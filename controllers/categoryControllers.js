import Category from "@/models/category";
import connectDB from "@/lib/mongodb";
import HttpError from "@/utils/httpError";
import authMiddleware from "@/middlewares/authMw";
import { checkAdmin } from "@/utils/checkRole";
export const getAllCategories = async (req) => {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true });
    return Response.json(
      { message: "Categories fetched successfully", categories },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const createCategory = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const { name, image, type } = await req.json();
    const existing = await Category.findOne({ name });
    if (existing) throw new HttpError(400, "Category already exists");
    const category = await Category.create({ name, image, type });
    return Response.json(
      { message: "Category created successfully", category },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const updateCategory = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const category = await Category.findById(id);
    if (!category) throw new HttpError(404, "Category not found");
    const { name, image, type } = await req.json();
    const updated = await Category.findByIdAndUpdate(
      id,
      { name, image, type },
      { new: true },
    );
    return Response.json(
      { message: "Category updated successfully", category: updated },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const deleteCategory = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const category = await Category.findById(id);
    if (!category) throw new HttpError(404, "Category not found");

    await Category.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ message: "Category deleted" }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
