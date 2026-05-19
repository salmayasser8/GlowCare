// toggle user status
import connectDB from "@/lib/mongodb";
import authMiddleware from "@/middlewares/authMw";
import HttpError from "@/utils/httpError";
import User from "@/models/user";
import { checkAdmin } from "@/utils/checkRole";
export const toggleUserStatus = async (req, params) => {
  const { id } = params;
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const user = await User.findById(id);
    if (!user) throw new HttpError(404, "User not found");
    user.isActive = !user.isActive;
    await user.save();

    return Response.json(
      {
        message: `${user.name} ${user.isActive ? "activated" : "deactivated"}`,
        user,
      },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getAllUsers = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password -verificationToken -verificationTokenExpiry",
    );
    return Response.json({ users }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const changeUserRole = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    if (currentUser.role !== "admin")
      throw new HttpError(403, "Not authorized");
    const { role } = await req.json();
    if (role === "admin") throw new HttpError(400, "Cannot promote to admin");
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    return Response.json({ message: "Role updated", user }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.statusCode || 500 },
    );
  }
};
