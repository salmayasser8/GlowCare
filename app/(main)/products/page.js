"use client";
import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import Link from "next/link";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiFilter,
} from "react-icons/fi";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "@/app/components/ProductCard";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { user, token } = useAuthStore();
  const { setCart } = useCartStore();
  const searchParams = useSearchParams();
  const [wishlist, setWishlist] = useState(new Set());
  const [initialized, setInitialized] = useState(false);
  const [filtering, setFiltering] = useState(false);
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    fetchCategories();
    setInitialized(true);
  }, []);
  useEffect(() => {
    if (!initialized) return;
    fetchProducts();
  }, [search, selectedCategory, minPrice, maxPrice, initialized]);
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
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category");
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    if (products.length === 0) {
      setLoading(true);
    } else {
      setFiltering(true);
    }
    try {
      let url = "/products?";
      if (search) url += `search=${search}&`;
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (minPrice) url += `minPrice=${minPrice}&`;
      if (maxPrice) url += `maxPrice=${maxPrice}&`;

      const { data } = await api.get(url);
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <section className=" py-5">
      <h2 className="fw-bold mb-4">All Products</h2>

      <Row className="justify-content-center ">
        {/*  Filters */}
        <Col lg={10}>
          <Card
            className="border-0 shadow-lg p-3 mb-5 "
            style={{ borderRadius: 12 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">
                <FiFilter className="me-2" />
                Filters
              </h6>
              <span
                className="small text-success"
                style={{ cursor: "pointer" }}
                onClick={clearFilters}
              >
                Clear all
              </span>
            </div>

            {/* Search */}

            <Form.Group className="d-flex gap-2 mb-3 ">
              <div className="position-relative w-50">
                <Form.Control
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
                <FiSearch
                  className="position-absolute"
                  style={{
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--primary)",
                  }}
                />
              </div>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-50"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Price Range */}
            <Form.Group className="mb-3">
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      {/* Products  */}
      <Row className="">
        <Col lg={12}>
          {loading ? (
            <div className="text-center py-5">
              <Riple
                color="var(--primary)"
                size="medium"
                text=""
                textColor=""
              />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <h5>No products found</h5>
              <p>Try different filters</p>
              <Button variant="outline-success" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted small mb-3">
                {products.length} products found
              </p>

              <ProductCard
                products={products}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            </>
          )}
        </Col>
      </Row>
    </section>
  );
}
