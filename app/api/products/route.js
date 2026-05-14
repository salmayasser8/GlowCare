import {
  createProduct,
  getAllProducts,
} from "@/controllers/productControllers";
export async function GET(req) {
  return getAllProducts(req);
}
export async function POST(req) {
  return createProduct(req);
}
