export default `
  type Query {
    shortenUrl(url: String!): Url!
  }

  type Url {
    shortUrl: String!
  }

`;
