const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    strUser: String,
    strComment: String,
    intStars: Number,
    dateReviewDate: { type: Date, default: Date.now }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    pkProductId: {
        type: mongoose.Schema.Types.ObjectId
    },
    strName: {
        type: String,
        required: true
    },
    intSellingPrice: {
        type: Number,
        required: true
    },
    intActualPrice: {
        type: Number,
        required: true
    },
    strCategory: {
        type: String,
        required: true
    },
    strBrand: String,
    strUnit: String,
    strImage: String,
    strDescription: {
        type: String,
        required: true
    },
    strWeight: String,
    intDiscountPercentage: Number,
    arrTags: {
        type: [String],
        required: true
    },
    blnIsAvailable: {
        type: Boolean,
        default: true
    },
    intStockQuantity: {
        type: Number,
        required: true
    },
    dateAddedDate: {
        type: Date,
        required: true
    },
    dateExpiryDate: {
        type: Date,
        required: true
    },
    strRfid: String,
    floatRatings: {
        type: Number,
        default: 0
    },
    arrReviews: {
        type: [ReviewSchema],
        default: []
    },
    intLimitPerUser: Number
});

// Copy _id to pkProductId before save
ProductSchema.pre('save', function (next) {
    if (!this.pkProductId) {
        this.pkProductId = this._id;
    }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
