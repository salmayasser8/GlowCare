export const dynamic = "force-dynamic";
import { getMyProfile, updateMyProfile } from "@/controllers/userControllers";
export async function GET(req) {
  return getMyProfile(req);
}
export async function PUT(req) {
  return updateMyProfile(req);
}
