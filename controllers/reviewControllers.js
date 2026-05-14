import Review from "@/models/review";
import connectDB from "@/lib/mongodb";
import authMiddleware from "@/middlewares/authMw";
import HttpError from "@/utils/httpError";
import Product from "@/models/product";

export const addReview = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { productId, rating, comment } = await req.json();
    const existing = await Review.findOne({
      user: currentUser._id,
      product: productId,
    });
    if (existing)
      throw new HttpError(400, "You have already reviewed this product");
    const review = await Review.create({
      user: currentUser._id,
      product: productId,
      rating,
      comment,
    });
    //update product rating
    const reviews = await Review.find({ product: productId });
    const average =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;
    await Product.findByIdAndUpdate(productId, {
      ratings: {
        average: average.toFixed(1),
        count: reviews.length,
      },
    });
    return Response.json(
      { message: "Review added successfully", review },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getProductReviews = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const reviews = await Review.find({ product: productId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });
    return Response.json({ reviews }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const deleteReview = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const review = await Review.findById(id);
    if (!review) throw new HttpError(404, "Review not found");
    if (
      review.user.toString() !== currentUser._id.toString() &&
      currentUser.role !== "admin"
    )
      throw new HttpError(403, "You are not authorized to delete this review");
    await Review.findByIdAndDelete(id);
    return Response.json(
      { message: "Review deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
