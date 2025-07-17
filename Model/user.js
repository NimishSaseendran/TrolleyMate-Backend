const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    pkUserId: {
        type: mongoose.Schema.Types.ObjectId
    },
    strName: {
        type: String,
        required: true
    },
    strEmail: {
        type: String,
        required: function () {
            return !this.strPhone;
        },
        unique: true,
        sparse: true
    },
    strPhone: {
        type: String,
        required: function () {
            return !this.strEmail;
        },
        unique: true,
        sparse: true
    },
    strPassword: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Copy _id to pkUserId before save
UserSchema.pre('save', function (next) {
    if (!this.pkUserId) {
        this.pkUserId = this._id;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
