export const dynamic = "force-dynamic";
import {
  updateCategory,
  deleteCategory,
} from "@/controllers/categoryControllers";
export async function PUT(req, { params }) {
  return updateCategory(req, params);
}
export async function DELETE(req, { params }) {
  return deleteCategory(req, params);
}
