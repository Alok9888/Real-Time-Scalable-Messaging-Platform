import mongoose from "mongoose";

const userModel = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String,
    default: ""
  },
  gender: { 
    type: String,
    enum: ["male", "female", "other"],
    required: true
  }
},{timestamps:true});

export default mongoose.model("User", userModel);

