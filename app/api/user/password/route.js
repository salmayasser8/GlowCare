import { changePassword } from "@/controllers/userControllers";
export async function PUT(req) {
  return changePassword(req);
}
