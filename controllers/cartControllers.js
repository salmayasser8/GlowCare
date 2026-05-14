import Cart from "@/models/cart";
import connectDB from "@/lib/mongodb";
import authMiddleware from "@/middlewares/authMw";
import HttpError from "@/utils/httpError";
import Product from "@/models/product";
//create
export const addToCart = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { productId, quantity = 1 } = await req.json();
    const product = await Product.findById(productId);
    if (!product) throw new HttpError(404, "Product not found");
    if (product.stock < quantity) throw new HttpError(400, "Not enough stock");
    const cart = await Cart.findOne({ user: currentUser._id });
    if (!cart) {
      const newCart = await Cart.create({
        user: currentUser._id,
        items: [{ product: productId, quantity }],
      });
      return Response.json(
        { message: "Product added to cart", cart: newCart },
        { status: 201 },
      );
    }
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (existingItem) {
      existingItem.quantity += quantity;
      await cart.save();
      return Response.json(
        { message: "Product added to cart", cart },
        { status: 200 },
      );
    }
    cart.items.push({ product: productId, quantity });
    await cart.save();
    return Response.json(
      { message: "Product added to cart", cart },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
//get cart
export const getCart = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const cart = await Cart.findOne({ user: currentUser._id }).populate(
      "items.product",
      "name price image stock",
    );
    if (!cart) return Response.json({ cart: { items: [] } }, { status: 200 });
    return Response.json({ cart }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const updateCart = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { quantity, productId } = await req.json();
    const cart = await Cart.findOne({ user: currentUser._id });
    if (!cart) return Response.json({ cart: { items: [] } }, { status: 200 });
    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!item) throw new HttpError(404, "Product not in cart");
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString(),
      );
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image stock",
    );
    return Response.json(
      { message: "Cart updated successfully", cart: updatedCart },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const clearCart = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    await Cart.findOneAndDelete({ user: currentUser._id });
    return Response.json(
      { message: "Cart cleared successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
