import { createPaymentIntent } from "@/controllers/paymentControllers";
export async function POST(req) {
  return createPaymentIntent(req);
}
