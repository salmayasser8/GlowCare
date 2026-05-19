"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import Link from "next/link";
import {
  FiTrash,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
export default function CartPage() {
  const { user, token, mounted } = useAuth();
  const { cart, setCart } = useCartStore();
  const [loading, setLoading] = useState(true);

  // all hooks first
  useEffect(() => {
    if (!mounted) return;
    if (!token) return;
    fetchCart();
  }, [mounted]);

  if (!mounted) return null;

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put("/cart", { productId, quantity });
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleClearCart = async () => {
    toast(
      (t) => (
        <div className="text-center px-2">
          <p className="mb-3 fw-semibold">Clear entire cart?</p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className=" rounded-pill px-3 py-2"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete("/cart");
                  setCart({ items: [] });
                  toast.success("Cart cleared!");
                } catch (err) {
                  toast.error("Something went wrong");
                }
              }}
            >
              Yes, Clear
            </button>
            <button
              className=" rounded-pill px-3 py-2"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + item.product?.price * item.quantity,
      0,
    ) || 0;

  // empty cart
  if (!loading && (!cart?.items || cart.items.length === 0)) {
    return (
      <section className=" py-5 text-center">
        <div style={{ fontSize: "5rem" }}>🛒</div>
        <h3 className="fw-bold mt-3">Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <Link href="/products">
          <Button className="rounded-pill px-4 mt-2">
            Shop Now <FiArrowRight className="ms-2" />
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Cart</h2>
        <Button
          variant="outline-danger"
          size="md"
          className="rounded-pill d-flex align-items-center gap-2 "
          onClick={handleClearCart}
        >
          <FiTrash /> Clear Cart
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : (
        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            {cart?.items?.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, x: 20 }}
                className="mb-3"
              >
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-0">
                    <div
                      key={item.product?._id}
                      className="d-flex align-items-center gap-3 p-3 border-bottom"
                    >
                      {/* Product Image */}
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "2rem" }}>🧴</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1">
                          {item.product?.name}
                        </h6>
                        <p className=" small mb-2">EGP {item.product?.price}</p>
                        {/* Quantity Controls */}
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            size="lg"
                            className="rounded-circle p-1"
                            style={{
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product?._id,
                                item.quantity - 1,
                              )
                            }
                          >
                            {item.quantity === 1 ? <FiTrash /> : <FiMinus />}
                          </Button>
                          <span
                            className="fw-bold px-2"
                            style={{ color: "var(--primary)" }}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            size="lg"
                            variant="outline-secondary"
                            className="rounded-circle p-1 "
                            style={{
                              width: 28,
                              height: 28,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product?._id,
                                item.quantity + 1,
                              )
                            }
                          >
                            <FiPlus />
                          </Button>
                        </div>
                      </div>

                      {/* Price + Remove */}
                      <div className="d-flex flex-column align-items-center ">
                        <div
                          className="fw-bold mb-4"
                          style={{ color: "var(--primary)" }}
                        >
                          EGP {(item.product?.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-lg" style={{ borderRadius: 12 }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cart?.items?.length} items)</span>
                  <span className="fw-semibold">
                    EGP {totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="fw-semibold">Free</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-success fs-5">
                    EGP {totalPrice.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button className="w-100 rounded-pill py-2 fw-bold">
                    Proceed to Checkout <FiArrowRight className="ms-2" />
                  </Button>
                </Link>

                <Link href="/products">
                  <Button className="w-100 rounded-pill py-2 mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </section>
  );
}
