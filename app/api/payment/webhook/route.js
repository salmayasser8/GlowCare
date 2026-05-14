import { handleWebhook } from "@/controllers/paymentControllers";
export async function POST(req) {
  return handleWebhook(req);
}
