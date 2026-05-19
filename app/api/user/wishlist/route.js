export const dynamic = "force-dynamic";
import { getWishlist, addToWishlist } from "@/controllers/userControllers";
export async function GET(req) {
  return getWishlist(req);
}
export async function POST(req) {
  return addToWishlist(req);
}
