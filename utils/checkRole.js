import HttpError from "@/utils/httpError";

export const checkAdmin = (user) => {
  if (user.role !== "admin")
    throw new HttpError(403, "Only admins can do this");
};

export const checkSeller = (user) => {
  if (user.role !== "seller")
    throw new HttpError(403, "Only sellers can do this");
};

export const checkAdminOrSeller = (user) => {
  if (user.role !== "admin" && user.role !== "seller")
    throw new HttpError(403, "Only admins and sellers can do this");
};
