export const dynamic = "force-dynamic";
import { updateOrderStatus, cancelOrder } from "@/controllers/orderControllers";
export async function PUT(req, { params }) {
  return updateOrderStatus(req, params);
}
export async function DELETE(req, { params }) {
  return cancelOrder(req, params);
}
