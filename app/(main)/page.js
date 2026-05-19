"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { Riple } from "react-loading-indicators";
import Link from "next/link";
import { FiArrowRight, FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { user, token } = useAuthStore();
  const { setCart } = useCartStore();
  const [wishlist, setWishlist] = useState(new Set());
  const loading = loadingCategories || loadingProducts;
  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/user/wishlist");
      const ids = data.wishlist.map((item) => item._id);
      setWishlist(new Set(ids));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category");
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await api.get("/products/featured");
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const { data } = await api.post("/cart", { productId, quantity: 1 });
      setCart(data.cart);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please login first");
      return;
    }
    const isWishlisted = wishlist.has(productId);
    try {
      if (isWishlisted) {
        await api.delete(`/user/wishlist/${productId}`);
        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from wishlist!");
      } else {
        await api.post("/user/wishlist", { productId });
        setWishlist((prev) => new Set(prev).add(productId));
        toast.success("Added to wishlist!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <section className="home">
        <Row className="align-items-center">
          <Col lg={6} className="my-5">
            <span className="badge mb-3 px-3 py-2 rounded-pill fw-bold">
              ✨ New Collection 2026
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#1b4332",
              }}
              className="heading-text mb-4"
            >
              Your Skin & Hair Deserves
              <br />
              <span style={{ color: "#2D6A4F" }}>The Best Care</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-muted mb-4 fs-5"
            >
              Discover premium skincare products crafted with natural
              ingredients. Glow from the inside out.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="d-flex gap-3 flex-wrap"
            >
              <Link href="/products">
                <Button size="lg" className="rounded-pill px-4">
                  Shop Now <FiArrowRight className="ms-2" />
                </Button>
              </Link>
              {!token && (
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline-success"
                    className="rounded-pill px-4"
                  >
                    Join GlowCare
                  </Button>
                </Link>
              )}
            </motion.div>
            <Row className="mt-5 g-3">
              {[
                { number: "500+", label: "Products" },
                { number: "10k+", label: "Happy Customers" },
                { number: "50+", label: "Brands" },
              ].map((stat) => (
                <Col xs={4} key={stat.label}>
                  <div>
                    <div
                      className=" fs-4"
                      style={{ color: "var(--primary)", fontFamily: "bold" }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-muted small">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col lg={6} className="text-center d-none d-lg-block">
            <div
              style={{
                width: 400,
                height: 400,
                background: "rgba(255,255,255,0.4)",
                borderRadius: "50%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "8rem",
              }}
            >
              🌿
            </div>
          </Col>
        </Row>
      </section>
      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : (
        <>
          <Categories id="categories" categories={categories} />
          <FeaturedProducts
            products={products}
            handleAddToCart={handleAddToCart}
            handleToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
          <AboutUs id="about" />
          <Footer />
        </>
      )}
    </>
  );
}
