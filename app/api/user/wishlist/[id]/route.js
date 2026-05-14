import { removeFromWishlist } from "@/controllers/userControllers";
export async function DELETE(req, context) {
  return removeFromWishlist(req, context);
}
