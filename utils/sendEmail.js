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
      <h1>Welcome to GlowCare! 🌿</h1>
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
  const itemsHtml = order.items
    .map((item) => {
      const name = item.product?.name || "Product";
      const qty = item.quantity;
      const price = item.price ?? item.product?.price ?? 0;
      return `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:center;">${qty}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">EGP ${(price * qty).toFixed(2)}</td>
      </tr>`;
    })
    .join("");

  await transporter.sendMail({
    from: `"GlowCare" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Order Confirmation",
    html: `
      <h1>Thank you for your order! 🌿</h1>
      <h5>Your order has been placed successfully.</h5>
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
       <p><strong>Products:</strong></p>
      <table style="width:50%;  border-collapse: collapse;">
        <thead>
           <tr style="background:#f0faf4;">
            <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="background:#f0faf4; border:1px solid #b7e4c7; border-radius:8px; padding:12px 16px; margin:16px 0; display:flex; align-items:center; gap:8px; width:fit-content;">
  🚚   <strong style="color:#2d6a4f; margin-inline: 5px;">Free Shipping</strong> — Your order ships on us!
</div>
      <p><strong>Total:</strong> EGP ${order.totalPrice}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <br/>
      <p>We will notify you when your order is shipped.</p>
    `,
  });
};
