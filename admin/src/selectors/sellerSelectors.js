import { createSelector } from "reselect";

// Base selector: Get all sellers
const selectSellers = (state) => state.seller.sellers;

// Memoized selector: Get only pending sellers
export const selectPendingRequests = createSelector(
    [selectSellers],
    (sellers) => sellers.filter((seller) => seller.status === "pending")
);
