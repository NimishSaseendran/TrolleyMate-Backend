const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: String,
        email: String,
        contact: String
    },
    items: [
        {
            productId: String,
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    paymentId: String,
    orderId: String,
    signature: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
