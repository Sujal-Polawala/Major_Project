const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Order {
    _id: ID!
    title: String!
    totalPrice: Float!
    createdAt: String!
    sellerId: ID!
  }

  type Query {
    seller(sellerId: ID!): [Order]
    orders(sellerId: ID!): [Order]
    order(sellerId: ID!): [Order]
    totalOrders: Int
    totalRevenue: Float
    totalProduct: Int
    totalUsers: Int
    totalSellers: Int
    totalOrdersBySeller(sellerId: ID!): Int
    totalProductsBySeller(sellerId: ID!): Int
    totalAdminIncome: Float
    sellers: [Seller]
    bestSellingProducts: [Product]
  }

  type Seller {
    _id: ID!
    name: String!
    orders: [Order]
    totalSales: Float!
  }

  type Product {
    _id: ID!
    title: String!
    sales: Int!
  }
`;

module.exports = typeDefs;
