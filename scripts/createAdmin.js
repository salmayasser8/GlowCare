import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import User from "../models/user.js";
import connectDB from "../lib/mongodb.js";

const createAdmin = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("Nour182003+", 10);

  await User.create({
    name: "nour",
    email: "nour@gmail.com",
    phone: "01270862682",
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
};

createAdmin();
