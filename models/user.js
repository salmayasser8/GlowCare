import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "password should be at least 8 chracters"],
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },

    verificationToken: String,
    verificationTokenExpiry: Date,
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  //encrypt password
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
