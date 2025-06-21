const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true

    },
    phonenumber: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    image: {
        type: String,
        default: null,
  },
    role: {
        type: String,
        enum: ["user", "instructor", "admin"],
        default: "user"
    },
    
});

module.exports = mongoose.model("User", userSchema);