import { updateOrderStatus, cancelOrder } from "@/controllers/orderControllers";
import authMw from "@/middlewares/authMw";
export async function PUT(req, { params }) {
  return updateOrderStatus(req, params);
}
export async function DELETE(req, { params }) {
  return cancelOrder(req, params);
}
