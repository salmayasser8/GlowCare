import Product from "@/models/product";
import connectDB from "@/lib/mongodb";
import HttpError from "@/utils/httpError";
import authMiddleware from "@/middlewares/authMw";
import { checkSeller } from "@/utils/checkRole";
import Category from "@/models/category";
export const createProduct = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkSeller(currentUser);
    const { name, description, price, category, image, stock, isFeatured } =
      await req.json();
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      isFeatured,
      seller: currentUser._id,
    });
    return Response.json(
      { message: "Product created successfully", product },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getAllProducts = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const query = { isActive: true };

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("seller", "name");
    return Response.json(
      { message: "Products fetched successfully", products },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getProductById = async (req, { id }) => {
  try {
    await connectDB();
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("seller", "name email");
    if (!product) throw new HttpError(404, "Product not found");
    return Response.json({ product }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const updateProduct = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const product = await Product.findById(id);
    if (!product) throw new HttpError(404, "Product not found");

    if (
      product.seller.toString() !== currentUser._id.toString() &&
      currentUser.role !== "admin"
    )
      throw new HttpError(403, "Not authorized");

    const data = await req.json();
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    return Response.json(
      { message: "Product updated", product: updated },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const deleteProduct = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const product = await Product.findById(id);
    if (!product) throw new HttpError(404, "Product not found");

    if (
      product.seller.toString() !== currentUser._id.toString() &&
      currentUser.role !== "admin"
    )
      throw new HttpError(403, "Not authorized");

    await Product.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const getFeaturedProducts = async () => {
  try {
    await connectDB();

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .populate("category", "name")
      .limit(8);

    return Response.json(
      { message: "Featured products fetched", products },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
