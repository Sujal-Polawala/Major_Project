import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:5000/graphql" }), // Your GraphQL Server
  cache: new InMemoryCache(),
});

export default client;
