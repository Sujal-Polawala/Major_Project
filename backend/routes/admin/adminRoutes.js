const express = require('express');
const { adminLogin } = require('../../controllers/admin/adminAuthController')

const { getTotalUsers, getTotalOrders, getTotalProducts, getStatus } = require('../../controllers/admin/dashboardController');
const { getSellerRequest, approveRequest, updateRequestStatus } = require('../../controllers/seller/sellerRequestContoller');
const router = express.Router();
// admin login
 router.post('/api/admin/login', adminLogin);

 // dashboard data
 router.get('/admin/total-users', getTotalUsers);
 router.get('/admin/total-orders', getTotalOrders);
 router.get('/admin/total-products', getTotalProducts);
router.put('/admin/users/:userId/status', getStatus);


router.get("/api/admin/seller-request", getSellerRequest);
router.put("/api/admin/approve-request", approveRequest);
router.put("/api/admin/update-request-status", updateRequestStatus);


module.exports = router;