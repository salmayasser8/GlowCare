export const dynamic = "force-dynamic";
import {
  createCategory,
  getAllCategories,
} from "@/controllers/categoryControllers";
export async function GET(req) {
  return getAllCategories(req);
}
export async function POST(req) {
  return createCategory(req);
}
