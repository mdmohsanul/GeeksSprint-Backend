import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";
dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  // get the user details
  // validation - not empty
  // check if the user is already exists: username, email
  // create user object
  // remove password and refresh token field from response
  // check for user creation
  // save the details to database

  const {
    email,
    name,
    password,
    role,
    skills,
    seniority,
    maxCapacity,
    department,
  } = req.body;

  if (!email || !name || !password || !role) {
    throw new ApiError(400, "Missing required fields");
  }
  // check if the user doesn't pass empty string
  if ([email, password, name, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Required fields cannot be empty");
  }

  if (!["engineer", "manager"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // Role-specific validation
  if (role === "engineer") {
    if (!skills?.length || !seniority || !maxCapacity || !department) {
      throw new ApiError(400, "Missing engineer-specific fields");
    }
  }

  // check if the user already exists or not
  // $ give access to many operator like and , or, etc
  const existeduser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "User already exists");
  }
  // if (role === 'manager') {
  //   delete req.body.skills;
  //   delete req.body.seniority;
  //   delete req.body.maxCapacity;
  //   delete req.body.department;
  // }

  // entry on database
  const user = await User.create({
    email,
    password,
    name,
    role,
    ...(role === "engineer" && {
      skills,
      seniority,
      maxCapacity,
      department,
    }),
  });

  // check if the user details is save in db or not.
  // if save then we have to send to frontend by removing the password and access token field

  // select will use to remove fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  // find user
  // generate access and refresh token
  // save refresh token in database
  // return access and refresh token

  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // now we have to save in DB but there is pasword validation in model, so to skip we user validateBeforeSave method
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generatingrefresh and access tokens"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { email, name, password } = req.body;
  console.log(req.body);
  if (!(name || email)) {
    throw new ApiError(400, "name or email is required");
  }
  const user = await User.findOne({
    $or: [{ name }, { email }],
  }).select("+password");
  if (!user) {
    throw new ApiError(404, "user doesn't exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn Successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  // get userId
  // remove accesstoken from database
  // remove cookies from frontend

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out Successfully"));
});

const getAllEngineers = asyncHandler(async (req, res) => {
  // get all engineers
  // select only required fields
  // send response

  const engineers = await User.find({ role: "engineer" }).select(
    "-password -refreshToken"
  );

  if (!engineers || engineers.length === 0) {
    throw new ApiError(404, "No engineers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, engineers, "Engineers fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params; // or get from req.user if authenticated
  const { name, department, seniority, skills, maxCapacity } = req.body;

  // Validate required update fields (if needed)
  if ([name, department, seniority].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Fields cannot be empty");
  }

  // Optionally validate seniority
  const validSeniority = ["junior", "mid", "senior"];
  if (seniority && !validSeniority.includes(seniority)) {
    throw new ApiError(400, "Invalid seniority value");
  }

  // Prepare update object
  const updateFields = {};

  if (name) updateFields.name = name;
  if (department) updateFields.department = department;
  if (seniority) updateFields.seniority = seniority;
  if (skills) updateFields.skills = skills;
  if (typeof maxCapacity !== "undefined")
    updateFields.maxCapacity = maxCapacity;

  // Update in DB
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found or update failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllEngineers,
  updateUserDetails,
};