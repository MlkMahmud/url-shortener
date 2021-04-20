import path from 'path';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { PrismaClient } from '@prisma/client';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const app = express();
const db = new PrismaClient();

app.use('/graphiql', graphqlHTTP((req) => ({
  schema: makeExecutableSchema({ resolvers, typeDefs }),
  context: {
    db,
    req,
  },
  graphiql: true,
})));

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const link = await db.url.findUnique({ where: { id } });
  if (link) {
    res.redirect(link.originalUrl);
  } else res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

export default app;
