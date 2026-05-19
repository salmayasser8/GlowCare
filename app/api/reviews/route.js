export const dynamic = "force-dynamic";
import { addReview, getProductReviews } from "@/controllers/reviewControllers";
export async function POST(req) {
  return addReview(req);
}
export async function GET(req) {
  return getProductReviews(req);
}
