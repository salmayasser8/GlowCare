export const dynamic = "force-dynamic";
import { changePassword } from "@/controllers/userControllers";
export async function PUT(req) {
  return changePassword(req);
}
