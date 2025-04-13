const mongoose = require('mongoose')

const wishSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products : [
        {
            productId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product',
                required : true,
            },
            addedAt: {
                type : Date,
                default : Date.now,
            },
        },
    ],
});

const WishList = mongoose.model('WishList' , wishSchema , 'WishList')
module.exports = WishList;