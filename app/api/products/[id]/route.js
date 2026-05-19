export const dynamic = "force-dynamic";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/controllers/productControllers";
export async function GET(req, { params }) {
  return getProductById(req, params);
}
export async function PUT(req, { params }) {
  return updateProduct(req, params);
}
export async function DELETE(req, { params }) {
  return deleteProduct(req, params);
}
