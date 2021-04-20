import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
  Query: {
    shortenUrl: async (_, { url }, context) => {
      try {
        const [data] = await prisma.$queryRaw(
          `UPDATE url
            SET "isActive" = true,
                "originalUrl" = $1
          WHERE id = (
            SELECT id
            FROM url
            WHERE "isActive" = false
            LIMIT 1
          )
          RETURNING id;`,
          url,
        );
        return { shortUrl: `https://${context.req.headers.host}/${data.id}` };
      } catch (e) {
        console.error(e);
        throw new Error('Internal server error');
      }
    },
  },
};
