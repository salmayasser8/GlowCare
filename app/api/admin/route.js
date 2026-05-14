import { getAllUsers } from "@/controllers/adminControllers";
export async function GET(req) {
  return getAllUsers(req);
}
