const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    phonenumber: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        default: null
    },
    fullname: String,
    dob: Date,
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    image: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "instructor", "admin"],
        default: "user"
    },
});

module.exports = mongoose.model("User", userSchema);
