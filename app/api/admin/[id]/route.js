import { toggleUserStatus } from "@/controllers/adminControllers";
export async function PATCH(req, { params }) {
  return toggleUserStatus(req, params);
}
