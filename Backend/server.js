const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const http = require('http'); 


// Initialize dotenv to load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server


// Middleware
app.use(cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("public/images"));


app.use("/certificates", express.static(path.join(__dirname, "certificates")));


app.use("/api/home", require("./routes/HomeRoutes"));

// // [SECTION] Routes
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/instructorRoutes/mediaRoute");
const instructorCourseRoutes = require("./routes/instructorRoutes/coursesRoutes");
const studentCourseRoutes = require("./routes/studentRoutes/coursesRoutes");
const cartRoutes = require("./routes/studentRoutes/CartRoutes");
const orderRoute = require("./routes/studentRoutes/OrderRoutes");
const studentcoursesRoute = require("./routes/studentRoutes/StudentCoursesRoutes");
const courseProgressRoute = require("./routes/studentRoutes/CourseProgressRoute");
const certificateRoutes = require("./routes/studentRoutes/CertificateRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const ratingRoutes = require("./routes/studentRoutes/RatingRoutes");


app.use("/users", userRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentCourseRoutes);
app.use("/cart", cartRoutes);
app.use("/order",orderRoute );
app.use("/studentCourses",studentcoursesRoute );
app.use("/course/progress",courseProgressRoute );
app.use("/certificate", certificateRoutes);
app.use("/comment", commentRoutes);
app.use("/rating", ratingRoutes);


// Start the server
const port = 4000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
module.exports = app;  
