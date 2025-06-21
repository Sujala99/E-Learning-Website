const axios = require("axios");
const Order = require("../../models/OrderModels");
const Course = require("../../models/coursesModels");
const StudentCourses = require("../../models/StudentCourses");

exports.initKhaltiOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    if (!userId || !coursePricing || isNaN(coursePricing)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid fields",
      });
    }

    const order = new Order({
      userId,
      userName,
      userEmail,
      orderStatus: "pending",
      paymentMethod: "khalti",
      paymentStatus: "unpaid",
      orderDate: new Date(),
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing: Number(coursePricing),
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        amount: Number(coursePricing) * 100, // Convert to paisa
      },
    });
  } catch (err) {
    console.log("Order init error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Khalti order",
    });
  }
};


// After payment from frontend (token + amount sent to backend)
exports.verifyKhaltiPayment = async (req, res) => {
  try {
    const { token, amount, orderId } = req.body;

    const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      {
        token,
        amount,
      },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
        },
      }
    );

    if (response.data && response.data.idx) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = response.data.idx; // Save Khalti transaction ID
      await order.save();

      // Update student course record
      const studentCourses = await StudentCourses.findOne({ userId: order.userId });

      if (studentCourses) {
        studentCourses.courses.push({
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        });

        await studentCourses.save();
      } else {
        await StudentCourses.create({
          userId: order.userId,
          courses: [
            {
              courseId: order.courseId,
              title: order.courseTitle,
              instructorId: order.instructorId,
              instructorName: order.instructorName,
              dateOfPurchase: order.orderDate,
              courseImage: order.courseImage,
            },
          ],
        });
      }

      // Add student to course record
      await Course.findByIdAndUpdate(order.courseId, {
        $addToSet: {
          students: {
            studentId: order.userId,
            studentName: order.userName,
            studentEmail: order.userEmail,
            paidAmount: order.coursePricing,
          },
        },
      });

      res.status(200).json({ success: true, message: "Payment verified", data: order });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Khalti Verification Error:", err?.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: "Error verifying Khalti payment",
    });
  }
};


exports.simulatePaymentSuccess = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Missing user or cart items." });
    }

    let studentDoc = await StudentCourses.findOne({ userId });

    if (studentDoc) {
      const newCourses = cartItems.filter(
        (course) => !studentDoc.courses.some(
          (c) => c.courseId === course._id || c.courseId === course.courseId
        )
      );

      for (const course of newCourses) {
        studentDoc.courses.push({
          courseId: course._id,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.courseImage,
        });
      }

      await studentDoc.save();
    } else {
      await StudentCourses.create({
        userId,
        courses: cartItems.map((course) => ({
          courseId: course._id,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.courseImage,
        })),
      });
    }

    res.status(200).json({ success: true, message: "Courses saved (simulated payment)" });
  } catch (error) {
    console.error("Simulated payment failed:", error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};
