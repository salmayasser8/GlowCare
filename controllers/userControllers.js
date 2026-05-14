import User from "@/models/user";
import connectDB from "@/lib/mongodb";
import authMiddleware from "@/middlewares/authMw";
import HttpError from "@/utils/httpError";
export const getMyProfile = async (req) => {
  try {
    await connectDB();

    const currentUser = await authMiddleware(req);
    
    const user = await User.findById(currentUser._id).select(
      "-password -verificationToken -verificationTokenExpiry",
    );

    return Response.json({ user }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const updateMyProfile = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { name, phone, address } = await req.json();
    const user = await User.findByIdAndUpdate(
      currentUser._id,
      {
        name,
        phone,
        address: {
          street: address.street,
          city: address.city,
          country: address.country,
        },
      },
      { new: true },
    ).select("-password -verificationToken -verificationTokenExpiry");
    return Response.json(
      { message: "Profile updated successfully", user },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const changePassword = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { oldPassword, newPassword } = await req.json();
    const user = await User.findById(currentUser._id);
    if (!user) throw new HttpError(404, "User not found");
    if (!(await user.comparePassword(oldPassword)))
      throw new HttpError(401, "old password is incorrect");
    user.password = newPassword;
    await user.save();
    return Response.json(
      { message: "Password changed successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getWishlist = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const user = await User.findById(currentUser._id).populate(
      "wishlist",
      "name image price",
    );
    return Response.json({ wishlist: user.wishlist }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const addToWishlist = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { productId } = await req.json();
    const user = await User.findById(currentUser._id);
    if (!user) throw new HttpError(404, "User not found");
    if (user.wishlist.includes(productId))
      throw new HttpError(400, "Product already in wishlist");
    user.wishlist.push(productId);
    await user.save();
    return Response.json(
      { message: "Product added to wishlist successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const removeFromWishlist = async (req, context) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { id } = await context.params;
    const user = await User.findById(currentUser._id);
    if (!user) throw new HttpError(404, "User not found");
    user.wishlist = user.wishlist.filter(
      (pid) => pid.toString() !== id.toString(),
    );
    await user.save();
    return Response.json(
      { message: "Product removed from wishlist successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
