import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: { type: String, required:  [true, "Name is required"], },
  role: {
    type: String,
    enum: ['engineer', 'manager'],
    required:  [true, "Role is required"],
  },
  skills: {
    type: [String],
    default: [],
  },
  seniority: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
  },
  maxCapacity: Number,
  department: String,
  password: { type: String, required: true }, // hashed password
   refreshToken: {
      type: String,
    },
}, { timestamps: true })

// pre is hook provided by mongoose which will execute before save
// this function will execute in two scenarios register or change password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// method to check if the password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User",userSchema)