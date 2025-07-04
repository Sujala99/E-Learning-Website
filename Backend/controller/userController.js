const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userModels");
const Course = require("../models/coursesModels");
const SECRET_KEY = "8261ba19898d0dcdfe6c0c411df74b587b2f54538f5f451633b71e39f957cf01";
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID700718330885-0jcg4hkik40jn9a1b7u5joskq68g4tlu.apps.googleusercontent.com");


exports.registerUser = async (req, res) => {
    const { username, email, fullname, password, dob, gender, image, role} = req.body;

    try {

    const { username, email, fullname, password, dob, gender, image, role} = req.body;

        console.log("Received Data:", req.body); // Debugging: Check if all fields are received

        // Ensure all required fields are provided
        if (!username  || !email || !password) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }



        
        const existingUser = await User.findOne({ email: email.trim() });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            email: email.trim(),
            fullname,
            password: hashedPassword,
            dob,
            gender,
            image,
            role

        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: "User registered successfully",role });
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};



exports.loginUser = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Find the user by either username or email (case-insensitive)
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${email?.trim()}$`, 'i') } },
                { username: { $regex: new RegExp(`^${username?.trim()}$`, 'i') } },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};



exports.googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: "700718330885-0jcg4hkik40jn9a1b7u5joskq68g4tlu.apps.googleusercontent.com",
        });

        const { email, name, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user
            user = new User({
                email,
                fullname: name,
                username: email.split("@")[0],
                googleId: sub,
                image: picture,
                role: "user",
            });

            await user.save();
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed" });
    }
};



exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }

        // Check file size limit
        const maxSize = process.env.MAX_FILE_UPLOAD || 2 * 1024 * 1024; // Default 2MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                message: `Please upload an image less than ${maxSize / (1024 * 1024)}MB`,
            });
        }

        // Update user's image in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.image = req.file.filename;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is in the token payload

        // Find the user by their ID
        const user = await User.findById(userId).select("-password"); // Exclude password from the profile

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Return the user's profile details
        return res.status(200).json({
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            dob: user.dob,
            gender: user.gender,
            image: user.image,
            role: user.role,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Server error while fetching profile." });
    }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Collect updated fields
    const updatedUserData = {
      fullname: req.body.fullname || user.fullname,
      dob: req.body.dob || user.dob,
      gender: req.body.gender || user.gender,
      role: req.body.role || user.role,
    };

    // Optional: Image update via file
    if (req.file) {
      updatedUserData.image = req.file.filename;
    }

    // Optional: Password update
    if (req.body.password) {
      updatedUserData.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    }).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error while updating profile." });
  }
};


exports.getTopCourses = async (req, res) => {
  try {
    const courses = await Course.aggregate([{ $sample: { size: 9 } }]);
    res.json({ success: true, data: courses });
  } catch (err) {
    console.error("Error fetching top courses:", err);
    res.status(500).json({ success: false, message: "Server error while fetching courses" });
  }
};

// GET /api/home/instructors
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.aggregate([
      { $match: { role: "instructor" } },
      { $sample: { size: 6 } },
      { $project: { _id: 1, username: 1, image: 1 } }
    ]);

    res.json({ success: true, data: instructors });
  } catch (err) {
    console.error("Error fetching instructors:", err);
    res.status(500).json({ success: false, message: "Server error while fetching instructors" });
  }
};







// exports.resetPassword = async (req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         const userId = decoded.id;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Update the password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;

//         await user.save();
//         res.status(200).json({ message: "Password updated successfully." });
//     } catch (error) {
//         res.status(500).json({ message: "Invalid or expired token." });
//     }
// };


// const sendEmail = async (to, subject, text) => {
//     try {
//         console.log(`Sending email to: ${to}`); // Debug log
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL, // Your Gmail address
//                 pass: process.env.EMAIL_PASSWORD // Your Gmail password or app password
//             }
//         });

//         const mailOptions = {
//             from: process.env.EMAIL,
//             to,
//             subject,
//             text,
//         };

//         const result = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', result);
//     } catch (error) {
//         console.error('Error sending email:', error.message);
//     }
// };


// exports.uploadImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "Please upload a file" });
//         }

//         // Check file size limit
//         const maxSize = process.env.MAX_FILE_UPLOAD || 2 * 1024 * 1024; // Default 2MB
//         if (req.file.size > maxSize) {
//             return res.status(400).json({
//                 message: `Please upload an image less than ${maxSize / (1024 * 1024)}MB`,
//             });
//         }

//         // Update user's image in the database
//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         user.image = req.file.filename;
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Image uploaded successfully",
//             data: req.file.filename,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// // export const logout = (req, res) => {
// //     try {
// //         res.cookie("jwt", "", { maxAge: 0 });
// //         res.status(200).json({ message: "Logged out successfully" });
// //     } catch (error) {
// //         console.log("Error in logout controller", error.message);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // };


// exports.getUsersForSidebar = async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;

//         const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//         res.status(200).json(filteredUsers);
//     } catch (error) {
//         console.error("Error in getUsersForSidebar: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };





// exports.addUser = async (req, res) => {
//     try {
//         // Check if the user making the request is an admin
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied. Only admins can add users." });
//         }

//         const { username, phonenumber, email, password, fullname, dob, gender, address, image, role } = req.body;

//         // Validate required fields
//         if (!username || !phonenumber || !email || !password || !fullname) {
//             return res.status(400).json({ message: "All required fields must be provided." });
//         }

//         // Check for existing user
//         const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//         if (existingUser) {
//             return res.status(400).json({ message: "Username or Email already exists." });
//         }

//         // Create new user
//         const newUser = new User({
//             username,
//             phonenumber,
//             email,
//             password, // You should hash the password before saving
//             fullname,
//             dob,
//             gender,
//             address,
//             image,
//             role
//         });

//         await newUser.save();
//         res.status(201).json({ message: "User added successfully", user: newUser });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };



// exports.getProfile = async (req, res) => {// Controller function to get the user's profile
//     try {
//         // Use the 'id' from the token payload instead of '_id'
//         const userId = req.user.id; // Changed from req.user._id to req.user.id

//         // Find the user by their ID
//         const user = await User.findById(userId).select("-password"); // Exclude password from the profile

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Return the user's profile details
//         return res.status(200).json({
//             username: user.username,
//             phonenumber: user.phonenumber,
//             email: user.email,
//             fullname: user.fullname,
//             dob: user.dob,
//             gender: user.gender,
//             address: user.address,
//             image: user.image,
//             role: user.role,
//             description: user.description,
//             specialization: user.specialization,
//             qualification: user.qualification,
//             experience: user.experience,
//             fees: user.fees,
//             availableSlots: user.availableSlots
//         });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return res.status(500).json({ message: "Server error while fetching profile." });
//     }
// };



// exports.updateProfile = async (req, res) => {
//     try {
//         // Use the 'id' from the token payload instead of '_id'
//         const userId = req.user.id; // Assuming the user ID is in the token payload

//         // Find the user by their ID
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         // Handle password update: check if the new password is provided
//         let updatedUserData = {
//             username: req.body.username || user.username,
//             phonenumber: req.body.phonenumber || user.phonenumber,
//             email: req.body.email || user.email,
//             fullname: req.body.fullname || user.fullname,
//             dob: req.body.dob || user.dob,
//             gender: req.body.gender || user.gender,
//             address: req.body.address || user.address,
//             image: req.body.image || user.image, // Make sure the image is correctly updated
//             role: req.body.role || user.role,
//             description: req.body.description || user.description,
//             specialization: req.body.specialization || user.specialization,
//             qualification: req.body.qualification || user.qualification,
//             experience: req.body.experience || user.experience,
//             fees: req.body.fees || user.fees,
//             availableSlots: req.body.availableSlots || user.availableSlots
//         };

//         // If a new password is provided, hash it before updating
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(req.body.password, salt);
//             updatedUserData.password = hashedPassword;
//         }

//         // Update the user's profile
//         const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true }).select("-password");

//         // Return the updated profile
//         return res.status(200).json({
//             username: updatedUser.username,
//             phonenumber: updatedUser.phonenumber,
//             email: updatedUser.email,
//             fullname: updatedUser.fullname,
//             dob: updatedUser.dob,
//             gender: updatedUser.gender,
//             address: updatedUser.address,
//             image: updatedUser.image,
//             role: updatedUser.role,
//             description: updatedUser.description,
//             specialization: updatedUser.specialization,
//             qualification: updatedUser.qualification,
//             experience: updatedUser.experience,
//             fees: updatedUser.fees,
//             availableSlots: updatedUser.availableSlots
//         });
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         return res.status(500).json({ message: "Server error while updating profile." });
//     }
// };
