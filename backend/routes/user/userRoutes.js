const express = require('express');

const { getAllUser, getUserById} = require('../../controllers/user/userController');
const { addAddress } = require('../../controllers/address/addAddressController');
const { updateAddress } = require('../../controllers/address/updateAddressController');

const router = express.Router();

// userDetails 
router.get('/api/user/:userId', getUserById);

// get all users
router.get('/admin/users', getAllUser);

// add address

router.post('/api/user/add-address/:userId', addAddress);

// update address

router.put('/api/user/update-address/:userId', updateAddress);

module.exports = router;