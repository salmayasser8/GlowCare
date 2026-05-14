import Stripe from "stripe";
import Order from "@/models/order";
import connectDB from "@/lib/mongodb";
import HttpError from "@/utils/httpError";
import authMiddleware from "@/middlewares/authMw";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// create payment
export const createPaymentIntent = async (req) => {
  try {
    await connectDB();
    const currentUser = await authMiddleware(req);
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) throw new HttpError(404, "Order not found");

    if (order.user.toString() !== currentUser._id.toString())
      throw new HttpError(403, "Not authorized");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "egp",
      metadata: { orderId: orderId },
    });

    return Response.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};

export const handleWebhook = async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return Response.json(
        { message: "Webhook signature failed" },
        { status: 400 },
      );
    }

    // payment succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        stripePaymentId: paymentIntent.id,
      });
    }

    return Response.json({ received: true }, { status: 200 });
  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: err.status || 500 },
    );
  }
};
