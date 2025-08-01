const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendEbill = async (req, res) => {
    try {
        const { name, contact, cart } = req.body;

        const totalAmount = cart.reduce(
            (sum, item) => sum + item.intQuantity * item.intSellingPrice,
            0
        );

        const itemLines = cart.map(item =>
            `${item.strName} (${item.strBrand})\n` +
            `Category: ${item.strCategory}\n` +
            `Weight: ${item.strWeight} (${item.strUnit})\n` +
            `Qty: ${item.intQuantity} × ₹${item.intSellingPrice} = ₹${item.intQuantity * item.intSellingPrice}`
        ).join('\n\n');

        const message =
            `🧾 *TrolleyMate eBill*\n\n` +
            `👤 Customer: ${name}\n` +
            `📞 Contact: +91 ${contact}\n\n` +
            `Items Purchased:\n` +
            `----------------------------------------\n` +
            `${itemLines}\n` +
            `----------------------------------------\n\n` +
            `💰 *Total Amount:* ₹${totalAmount}\n\n` +
            `🙏 Thank you for shopping with us!`;

        const twilioResponse = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+91${contact}`,
            body: message,
        });

        res.status(200).json({ success: true, sid: twilioResponse.sid });
    } catch (err) {
        console.error('Twilio WhatsApp Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};