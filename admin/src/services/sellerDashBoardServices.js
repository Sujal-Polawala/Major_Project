import { useQuery } from "@apollo/client";
import { GET_SELLER_DASHBOARD } from "graphql/queries";

export const useSellerDashboard = (sellerId) => {
    const {loading , error , data} =useQuery(GET_SELLER_DASHBOARD, {
        variables: {sellerId},
        fetchPolicy: "no-cache",
    });
    return { loading, error, data };
}

