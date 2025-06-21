// models/Cart.js
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
