const express = require("express");
const userController = require("../controller/userController");
const { authenticateToken, authorizeRole } = require("../Security/Auth");
const router = express.Router();
const { upload } = require("../Security/uploads");




// User routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


router.post("/google-login", userController.googleLogin);
router.post('/uploadImage', authenticateToken, upload.single('profilePicture'), userController.uploadImage);
router.get("/profile", authenticateToken, userController.getProfile); 


router.put("/updateProfile", authenticateToken, upload.single("image"), userController.updateProfile);



router.get("/home/top-courses", userController.getTopCourses);
router.get("/home/instructors", userController.getInstructors);
// router.get("/getallusers", authenticateToken, us
// erController.getAllUser); 
// router.put("/updateuser/:id", authenticateToken, userController.updateUser); 
// router.delete("/deleteuser/:id", authenticateToken, userController.deleteUser); 

// // Image upload route


// router.post("/reset-password/:token", userController.resetPassword);


// router.get("/chatuser", authenticateToken, userController.getUsersForSidebar);

// router.post("/addUser", authenticateToken,userController.addUser);





// router.get("/getallusers", authenticateToken, userController.getAllUser); 

module.exports = router;