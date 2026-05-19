export const dynamic = "force-dynamic";
import { removeFromWishlist } from "@/controllers/userControllers";
export async function DELETE(req, context) {
  return removeFromWishlist(req, context);
}
