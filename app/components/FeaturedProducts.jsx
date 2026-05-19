"use client";
import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "./ProductCard";
const FeaturedProducts = ({
  products,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
}) => {
  const { user } = useAuthStore();
  return (
    <section className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className=" mb-0 ">Best Sellers</h2>
        <Link href="/products" className="text-success text-decoration-none ">
          View all <FiArrowRight />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5 ">
          <p>No products yet. Check back soon!</p>
        </div>
      ) : (
        <ProductCard
          products={products}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
        />
      )}
    </section>
  );
};
export default FeaturedProducts;
