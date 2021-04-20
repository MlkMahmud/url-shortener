import isValidUrl from 'is-url';

export default {
  Query: {
    shortenUrl: async (_, { url }, context) => {
      try {
        if (!isValidUrl(url)) {
          throw new Error(`The provided url: ${url} is invalid`);
        }
        const [data] = await context.db.$queryRaw(
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
        const message = e.message || 'Internal server error';
        throw new Error(message);
      }
    },
  },
};
