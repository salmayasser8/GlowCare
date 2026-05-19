export const dynamic = "force-dynamic";
import {
  getCart,
  addToCart,
  updateCart,
  clearCart,
} from "@/controllers/cartControllers";
export async function GET(req) {
  return getCart(req);
}
export async function POST(req) {
  return addToCart(req);
}
export async function PUT(req) {
  return updateCart(req);
}
export async function DELETE(req) {
  return clearCart(req);
}
