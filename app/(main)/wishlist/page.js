"use client";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import { FiHeart } from "react-icons/fi";
import Link from "next/link";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";
import ProductCard from "@/app/components/ProductCard";
export default function WishlistPage() {
  const { mounted } = useAuth("customer");
  const { setCart } = useCartStore();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    fetchWishlist();
  }, [mounted]);

  if (!mounted) return null;

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/user/wishlist");
      setWishlist(data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setWishlist(wishlist.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist!");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const { data } = await api.post("/cart", { productId, quantity: 1 });
      setCart(data.cart);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!loading && wishlist.length === 0) {
    return (
      <section className="py-5 text-center">
        <FiHeart size={64} color="var(--primary)" />
        <h3 className="fw-bold mt-3">Your wishlist is empty</h3>
        <p className="text-muted">Save products you love!</p>
        <Link href="/products">
          <Button className="rounded-pill px-4 mt-2">Browse Products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="py-5">
      <h2 className="fw-bold mb-4">
        My Wishlist{" "}
        <span className="text-muted small">({wishlist.length})</span>
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : (
        <ProductCard
          products={wishlist}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleRemove}
          wishlist={new Set(wishlist.map((p) => p._id))}
          isWishlistPage={true}
        />
      )}
    </section>
  );
}
