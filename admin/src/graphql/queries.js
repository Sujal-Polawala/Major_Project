import { gql } from "@apollo/client";

export const GET_SELLER_DASHBOARD = gql`
    query getSellerDashboard($sellerId : ID!){
        totalProductsBySeller(sellerId: $sellerId)
        totalOrdersBySeller(sellerId: $sellerId)
        seller(sellerId: $sellerId) {
            _id
            totalPrice
            createdAt
        }
        orders(sellerId: $sellerId) {
            _id
            title
            totalPrice
            createdAt
        }
        order(sellerId: $sellerId) {
            _id
            totalPrice
            createdAt
        }   
    }
`;