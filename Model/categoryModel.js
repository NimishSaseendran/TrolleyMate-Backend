const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        pkCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
        },
        categoryName: {
            type: String,
            required: true,
            trim: true,
        },
        categorySlug: {
            type: String,
            lowercase: true,
            trim: true,
        },
        categoryDescription: {
            type: String,
            default: '',
        },
        categoryImage: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

// Assign _id to pkCategoryId before saving
CategorySchema.pre('save', function (next) {
    if (!this.pkCategoryId) {
        this.pkCategoryId = this._id;
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
