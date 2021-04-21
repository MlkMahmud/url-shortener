import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';
import app from '../src/app';

const db = new PrismaClient();
const request = supertest(app);
const hash = 'gagdef';
const validUrl = 'https://google.com';
const invalidUrl = 'abcdef';
let shortUrl;

beforeAll(async () => {
  await db.$executeRaw(
    `INSERT INTO url (id) VALUES ($1)`,
    hash,
  );
});

afterAll(async () => {
  await db.$executeRaw('DELETE FROM url;');
  await db.$disconnect();
});


describe('/graphiql', () => {
  it('Should shorten a longUrl', async () => {
    const response = await request
      .post('/graphiql')
      .send({ query: ` { shortenUrl(url: "${validUrl}") { shortUrl } }` });
    expect(response.status).toBe(200);
    const { data: { shortenUrl } } = response.body;
    expect(shortenUrl).toHaveProperty('shortUrl');
    expect(shortenUrl.shortUrl).toMatch(new RegExp(`https://.*/${hash}`));
    shortUrl = shortenUrl.shortUrl;
  });

  it('Should not shorten an invalid url', async () => {
    const response = await request
      .post('/graphiql')
      .send({ query: ` { shortenUrl(url: "${invalidUrl}") { shortUrl } }` });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.data).toBeNull();
    expect(response.body.errors[0].message).toEqual(`The provided url: ${invalidUrl} is invalid`)
  });
});

describe('/:id', () => {
  it('Should redirect a valid shortUrl to the correct location', async () => {
    const response = await request.get(`/${hash}`);
    expect(response.status).toBe(302);
    expect(response.redirect)
    expect(response.headers.location).toEqual(validUrl);
  });

  it('Should render a 404 page if the shortUrl is invalid', async () => {
    const inValidHash = 'aaaabb';
    const response = await request.get(`/${inValidHash}`);
    expect(response.status).toBe(404);
    expect(response.type).toBe('text/html');
  });
})
