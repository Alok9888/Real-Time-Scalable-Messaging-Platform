import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, userName, password, gender, confirmPassword } = req.body;
    // Check if all required fields are provided, if not return a 400 status code with an error message
    if(!fullName || !userName || !password || !gender || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if password and confirmPassword match, if not return a 400 status code with an error message
    if(password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists, if yes return a 400 status code with an error message
    const user = await User.findOne({ userName });
    if(user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const malePhotoAvatar = "https://api.dicebear.com/10.x/line-face/svg?seed=Felix"
    const femalePhotoAvatar = "https://api.dicebear.com/10.x/line-face/svg?seed=Fiona"
    const otherPhotoAvatar = "https://api.dicebear.com/10.x/line-face/svg?seed=Alex"
    
    // Create a new user in the database with the provided details and hashed password
    await User.create({ 
      fullName, 
      userName, 
      password : hashedPassword, 
      gender, 
      profilePhoto: gender === "male" ? malePhotoAvatar : gender === "female" ? femalePhotoAvatar : otherPhotoAvatar 
    });
    // Return a 201 status code with a success message
    return res.status(201).json({ message: "User registered successfully" });
  }// Catch any errors and return a 500 status code with the error message
   catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const login = async (req, res) => {
  // Destructure userName and password from request body
  const { userName, password } = req.body;
  // Check if userName and password are provided, if not return a 400 status code with an error message
  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const tokenData = {
      id: user._id
    }
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1h" });
                  
    // Set token in cookie and return user data
    return res.status(200).cookie("token", token, { maxAge: 3600000, httpOnly: true, sameSite: "strict" }).json({ 
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePhoto: user.profilePhoto
    });
  } 
  // Catch any errors and return a 500 status code with the error message
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    // Clear the token cookie to log out the user
    return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" }).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getOtherUser = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    return res.status(200).json(otherUsers);
} catch (error) {
    res.status(500).json({ message: error.message });
  }
}
 
