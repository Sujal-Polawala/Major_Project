import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({ uri: "https://trynbuy-backend-myzl.onrender.com/graphql" }), // Your GraphQL Server
  cache: new InMemoryCache(),
});

export default client;
