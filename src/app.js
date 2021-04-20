import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import typeDefs from './typeDefs';

const app = express();

app.use('/graphiql', graphqlHTTP((req) => ({
  schema: makeExecutableSchema({ resolvers, typeDefs }),
  context: {
    req,
  },
  graphiql: true,
})));

export default app;
