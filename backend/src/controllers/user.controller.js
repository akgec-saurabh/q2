import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Some Error Occured while generating Access and Refresh Token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(409, "User already Exist");
  }

  const user = await User.create({
    username,
    email,
    password,
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiError(500, "Error Occured while creating User"));
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Successfully Created"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!existingUser) {
    return res
      .status(404)
      .json(
        new ApiError(404, "User does not exist. Please check your Credentials")
      );
  }

  const isPasswordValid = existingUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiError(401, "Please check your Credentials"));
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(existingUser._id);

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );
  //cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: { loggedInUser, accessToken, refreshToken } },
        "User LoggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  ).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access");
  }

  let decodedToken;
  let user;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Some error Occured while refreshing access Token")
      );
  }
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessTokenAndRefreshToken(decodedToken._id);

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(
      new ApiResponse(
        200,
        {
          user: { user, accessToken, refreshToken: newRefreshToken },
        },
        "Token Refreshed"
      )
    );
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
