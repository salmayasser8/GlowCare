"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiMinus,
  FiPlus,
  FiArrowLeft,
} from "react-icons/fi";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { setCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews?productId=${id}`);
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const { data } = await api.post("/cart", { productId: id, quantity });
      setCart(data.cart);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login first");
      return;
    }
    setReviewLoading(true);
    try {
      await api.post("/reviews", { productId: id, ...reviewForm });
      toast.success("Review added!");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading)
    return (
      <section className="py-5 text-center">
        <Riple color="var(--primary)" size="medium" text="" textColor="" />
      </section>
    );

  if (!product)
    return (
      <section className="py-5 text-center">
        <h3>Product not found</h3>
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </section>
    );
  console.log(product.seller);
  return (
    <section className="py-5">
      {/* Back button */}
      <Button
        variant="outline-secondary"
        className="rounded-pill mb-4"
        onClick={() => router.back()}
      >
        <FiArrowLeft className="me-2" /> Back
      </Button>
      <Row className="g-5">
        {/* Product Image */}
        <Col lg={5}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              background: "#F0FAF4",
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "6rem" }}>🧴</span>
              )}
            </motion.div>
          </div>
        </Col>

        {/* Product Info */}
        <Col lg={7}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className=" mb-2" style={{ color: "var(--primary)" }}>
              {product.category?.name}
            </div>
            <h1 className="fw-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={18}
                  color="#FFC107"
                  fill={star <= product.ratings?.average ? "#FFC107" : "none"}
                />
              ))}
              <span className="text-muted small">
                {product.ratings?.average || 0} ({product.ratings?.count || 0}{" "}
                reviews)
              </span>
            </div>

            <h2 className="fw-bold  mb-4">EGP {product.price}</h2>

            <p className="mb-4">{product.description}</p>

            {/* Stock */}
            <div className="mb-4">
              <span
                className="small"
                style={{
                  color:
                    product.stock === 0
                      ? "#DC3545"
                      : product.stock < 5
                        ? "#FFA500"
                        : "var(--primary)",
                }}
              >
                {product.stock === 0
                  ? "Out of stock"
                  : product.stock < 5
                    ? `Only ${product.stock} left!`
                    : `✓ In stock (${product.stock})`}
              </span>
            </div>
          </motion.div>
          {/* Quantity + Add to Cart */}
          {(user?.role === "customer" || !user) && product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
              {/* Quantity */}
              <div className="d-flex align-items-center gap-2 border border-success rounded-pill px-3 py-2">
                <FiMinus
                  style={{ cursor: "pointer" }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                />
                <span className="fw-bold px-2">{quantity}</span>
                <FiPlus
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                />
              </div>

              <Button
                className="rounded-pill px-3 py-2 flex-grow-1"
                onClick={handleAddToCart}
              >
                <FiShoppingCart className="me-2" /> Add to Cart
              </Button>

              <FiHeart
                size={20}
                onClick={(e) => handleToggleWishlist(e, product._id)}
                style={{
                  cursor: "pointer",
                  color: wishlist?.has(product._id) ? "red" : "var(--primary)",
                  fill: wishlist?.has(product._id) ? "red" : "none",
                }}
              />
            </div>
          )}

          {/* Seller info */}
          <div className="small " style={{ color: "var(--primary)" }}>
            Sold by: <strong>{product.seller?.name}</strong>
          </div>
        </Col>
      </Row>
      {/* Reviews Section */}
      <Row className="mt-5">
        <Col lg={8}>
          <h3 className="fw-bold mb-4">Reviews ({reviews.length})</h3>

          {/* Add Review Form */}
          {user?.role === "customer" && (
            <Card
              className="border-0 shadow-sm mb-4"
              style={{ borderRadius: 12 }}
            >
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Write a Review</h6>
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={24}
                          style={{ cursor: "pointer" }}
                          color="#FFC107"
                          fill={star <= reviewForm.rating ? "#FFC107" : "none"}
                          onClick={() =>
                            setReviewForm({ ...reviewForm, rating: star })
                          }
                        />
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Share your experience..."
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="rounded-pill px-4"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? <Spinner size="sm" /> : "Submit Review"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length === 0 && user?.role === "customer" ? (
            <p className="text-muted">No reviews yet. Be the first!</p>
          ) : (
            reviews.map((review) => (
              <Card
                key={review._id}
                className="border-0 shadow-lg mb-3"
                style={{ borderRadius: 12 }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div
                        className="fw-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        {review.user?.name}
                      </div>
                      <div className="d-flex gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={14}
                            color="#FFC107"
                            fill={star <= review.rating ? "#FFC107" : "none"}
                          />
                        ))}
                      </div>
                      <p className=" small mb-0">{review.comment}</p>
                    </div>
                    <div className="small" style={{ color: "var(--primary)" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </section>
  );
}
