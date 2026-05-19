export const dynamic = "force-dynamic";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
} from "@/controllers/orderControllers";
import authMw from "@/middlewares/authMw";
export async function POST(req) {
  return placeOrder(req);
}
export async function GET(req) {
  const currentUser = await authMw(req);
  if (currentUser.role === "admin") return getAllOrders(req);
  return getMyOrders(req);
}
