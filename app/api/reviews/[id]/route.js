export const dynamic = "force-dynamic";
import { deleteReview } from "@/controllers/reviewControllers";
export async function DELETE(req, { params }) {
  return deleteReview(req, params);
}
