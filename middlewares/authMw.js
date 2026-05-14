import HttpError from "@/utils/httpError.js";
import jwt from "jsonwebtoken";
import User from "@/models/user.js";
import connectDB from "@/lib/mongodb.js";
export default async (req) => {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new HttpError(401, "no token provided");
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) throw new HttpError(401, "no token provided");
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    );
    const user = await User.findById(payload.userId);
    if (!user) throw new HttpError(401, "invalid token");
    if (!user.isActive)
      throw new HttpError(403, "Your account has been disabled");
    return user;
  } catch (err) {
    throw err;
  }
};
