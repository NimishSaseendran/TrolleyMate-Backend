const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_Zm9oq5UlG8m7DW',
    key_secret: 'EfPdNSwfcwFiIxKfgVfYdSDK',
});

exports.createOrder = async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: 'receipt_' + Date.now(),
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        console.error('Error creating Razorpay order:', err);
        res.status(500).json({ error: 'Order creation failed' });
    }
};
