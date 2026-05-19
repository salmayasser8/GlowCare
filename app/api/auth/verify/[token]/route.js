export const dynamic = "force-dynamic";
import { verify } from "@/controllers/authControllers";
export async function GET(request, { params }) {
  return verify(request, params);
}