import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FiShoppingCart, FiHeart, FiStar, FiTrash } from "react-icons/fi";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
const ProductCard = ({
  products,
  handleAddToCart,
  handleToggleWishlist,
  wishlist,
  isWishlistPage = false,
}) => {
  const { user } = useAuthStore();
  return (
    <Row className="g-4">
      {products.map((product) => (
        <Col key={product._id} xs={6} md={4} lg={3}>
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ borderRadius: 12, transition: "all 0.3s ease" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  height: 200,
                  borderRadius: "12px 12px 0 0",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F0FAF4",
                }}
              >
                <Link
                  href={`/products/${product._id}`}
                  className="text-decoration-none"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: "3rem" }}>🧴</span>
                  )}
                </Link>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className="fs-6 "
                  style={{ color: "var(--primary)" }}
                >
                  {product.name}
                </Card.Title>
                <div className="d-flex align-items-center gap-1 mb-2">
                  <FaStar size={13} color="#FFC107" />
                  <span className="small">
                    {product.ratings?.average || "0"} (
                    {product.ratings?.count || 0})
                  </span>
                </div>
                <div
                  className="  mb-1"
                  style={{ color: "var(--primary)", fontFamily: "bold" }}
                >
                  EGP {product.price}
                </div>
                {(user?.role === "customer" || !user) && (
                  <div className="d-flex align-items-center gap-2 mt-auto">
                    <Button
                      size="sm"
                      className="flex-grow-1 rounded-2 fw-bold"
                      onClick={(e) => handleAddToCart(e, product._id)}
                    >
                      <FiShoppingCart size={14} className="me-1 " /> Add to Cart
                    </Button>
                    {isWishlistPage ? (
                      <FiTrash
                        size={16}
                        onClick={(e) => handleToggleWishlist(product._id)}
                        style={{
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    ) : (
                      <FiHeart
                        size={16}
                        onClick={(e) => handleToggleWishlist(e, product._id)}
                        style={{
                          cursor: "pointer",
                          color: wishlist?.has(product._id)
                            ? "red"
                            : "var(--primary)",
                          fill: wishlist?.has(product._id) ? "red" : "none",
                        }}
                      />
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
};

export default ProductCard;
