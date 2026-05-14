import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"GlowCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your GlowCare account",
    html: `
      <h2>Welcome to GlowCare! 🌿</h2>
      <p >Click the button below to verify your email:</p>
      <a href="${verificationUrl}" 
         style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};
export const sendOrderConfirmationEmail = async (email, order) => {
  await transporter.sendMail({
    from: `"GlowCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Order Confirmation",
    html: `
     <h2>Thank you for your order! 🌿</h2>
      <p>Your order has been placed successfully.</p>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> $${order.totalPrice}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <br/>
      <p>We will notify you when your order is shipped.</p>
    `,
  });
};
