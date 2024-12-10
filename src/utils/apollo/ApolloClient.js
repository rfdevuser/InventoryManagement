/*eslint complexity: ["error", 6]*/
// apolloClient.js

import { ApolloClient, InMemoryCache } from '@apollo/client';

console.log('GRAPHQL_ENDPOINT:', process.env.GRAPHQL_ENDPOINT);
const client = new ApolloClient({
  uri: 'https://www.onatiglobal.com/graphql', 
  // uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});



export default client;
