// controllers/cartController.js
const Cart = require("../../models/CartModels");
const Course = require("../../models/coursesModels");

// Add course to cart
exports.addToCart = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let cart = await Cart.findOne({ student: studentId });

    if (!cart) {
      cart = new Cart({ student: studentId, courses: [courseId] });
    } else {
      if (cart.courses.includes(courseId)) {
        return res.status(400).json({ message: "Course already in cart" });
      }
      cart.courses.push(courseId);
    }

    await cart.save();
    res.status(200).json({ message: "Course added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get cart by student ID
exports.getCart = async (req, res) => {
  const { studentId } = req.params;

  try {
    const cart = await Cart.findOne({ student: studentId }).populate("courses");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a course from cart
exports.removeFromCart = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    const cart = await Cart.findOne({ student: studentId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.courses = cart.courses.filter(id => id.toString() !== courseId);
    await cart.save();

    res.status(200).json({ message: "Course removed from cart", cart });
  } catch (err) {
    console.error("Failed to remove course from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// Clear the entire cart
exports.clearCart = async (req, res) => {
  const { studentId } = req.body;

  try {
    const cart = await Cart.findOne({ student: studentId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.courses = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// controllers/cartController.js

// exports.removeFromCart = async (req, res) => {
//   const { studentId, courseId } = req.body;

//   try {
//     const cart = await Cart.findOne({ student: studentId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const initialLength = cart.courses.length;

//     cart.courses = cart.courses.filter(
//       (id) => id.toString() !== courseId
//     );

//     if (cart.courses.length === initialLength) {
//       return res.status(404).json({ message: "Course not found in cart" });
//     }

//     await cart.save();

//     res.status(200).json({ message: "Course removed from cart", cart });
//   } catch (err) {
//     console.error("Remove from cart failed:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
