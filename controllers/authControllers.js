import User from "@/models/user";
import HttpError from "@/utils/httpError";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/sendEmail";
import connectDB from "@/lib/mongodb";
export const register = async (req) => {
  try {
    await connectDB();
    const { name, email, password, phone, role, address } = await req.json();
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      throw new HttpError(400, "User already exists");
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      address,
      verificationToken,
      verificationTokenExpiry,
    });
    await sendVerificationEmail(email, verificationToken);

    return Response.json(
      {
        message: "Registered! Please check your email to verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 },
    );
  }
};

export const login = async (req) => {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    if (!(await user.comparePassword(password)))
      throw new HttpError(401, "invalid credentials");
    if (!user.isVerified)
      throw new HttpError(403, "Please verify your email first");
    if (!user.isActive)
      throw new HttpError(403, "Your account has been disabled");
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
      },
    );
    return Response.json(
      { message: "User authenticated successfully", user, accessToken },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 },
    );
  }
};

export const verify = async (req, { token }) => {
  try {
    await connectDB();

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) throw new HttpError(400, "Invalid or expired verification link");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return Response.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL),
    );
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.statusCode || 500 },
    );
  }
};
