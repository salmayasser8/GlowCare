import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["hair", "skin", "other"],
      default: "other",
    },
  },
  { timestamps: true },
);
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
