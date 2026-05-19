import Order from "@/models/order";
import connectDB from "@/lib/mongodb";
import authMiddleware from "@/middlewares/authMw";
import HttpError from "@/utils/httpError";
import User from "@/models/user";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { sendOrderConfirmationEmail } from "@/utils/sendEmail";
import { checkAdmin, checkAdminOrSeller } from "@/utils/checkRole";
export const placeOrder = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { paymentMethod, shippingAddress } = await req.json();
    const cart = await Cart.findOne({ user: currentUser._id }).populate(
      "items.product",
      "name price stock",
    );
    if (!cart || cart.items.length === 0)
      throw new HttpError(400, "Cart is empty");
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        throw new HttpError(400, `Not enough stock for ${item.product.name}`);
    }
    let totalPrice = 0;
    const items = cart.items.map((item) => {
      totalPrice += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });
    const order = await Order.create({
      user: currentUser._id,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });
    await User.findByIdAndUpdate(currentUser._id, {
      address: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        country: shippingAddress.country,
      },
    });
    const populatedOrder = await Order.findById(order._id).populate(
      "items.product",
      "name price",
    );
    if (paymentMethod !== "credit card") {
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        });
      }
      await Cart.findOneAndDelete({ user: currentUser._id });
      try {
        await sendOrderConfirmationEmail(currentUser.email, populatedOrder);
      } catch (emailErr) {
        console.error("Failed to send order confirmation email:", emailErr);
      }
    }
    return Response.json(
      { message: "Order placed successfully", order },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getMyOrders = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const orders = await Order.find({ user: currentUser._id })
      .populate("items.product", "name price image stock")
      .sort({ createdAt: -1 });
    return Response.json({ orders }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const getAllOrders = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdmin(currentUser);
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price ")
      .sort({ createdAt: -1 });
    return Response.json({ orders }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const updateOrderStatus = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    checkAdminOrSeller(currentUser);
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new HttpError(404, "Order not found");
    return Response.json({ order }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
export const cancelOrder = async (req, { id }) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const order = await Order.findById(id);
    if (!order) throw new HttpError(404, "Order not found");
    if (order.user.toString() !== currentUser._id.toString())
      throw new HttpError(403, "You are not authorized to cancel this order");
    if (order.status !== "pending")
      throw new HttpError(400, "Only pending orders can be cancelled");
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
    order.status = "cancelled";
    await order.save();
    return Response.json(
      { message: "Order cancelled successfully" },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
