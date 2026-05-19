"use client";
import { useState, useEffect } from "react";
import { Container, Card, Badge, Button, Row, Col } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import { FiPackage, FiX } from "react-icons/fi";
import api from "@/lib/axios";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
export default function OrdersPage() {
  const { mounted } = useAuth("customer");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    if (!mounted) return;
    fetchOrders();
  }, [mounted]);

  if (!mounted) return null;

  const fetchOrders = async () => {
    console.log("fetchOrders called");
    try {
      const { data } = await api.get("/order");
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    toast(
      (t) => (
        <div className="text-center">
          <p className="mb-2">Are you sure you want to cancel this order?</p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className=" rounded-pill px-3 py-2"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/order/${id}`);
                  toast.success("Order cancelled!");
                  fetchOrders();
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Something went wrong",
                  );
                }
              }}
            >
              Yes, Cancel
            </button>
            <button
              className=" rounded-pill px-3 py-2"
              onClick={() => toast.dismiss(t.id)}
            >
              Keep Order
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const statusColor = {
    pending: "warning",
    confirmed: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };

  if (!loading && orders.length === 0) {
    return (
      <Container className="py-5 text-center">
        <FiPackage size={64} color="#ccc" />
        <h3 className="fw-bold mt-3">No orders yet</h3>
        <p className="text-muted">Start shopping to see your orders here!</p>
      </Container>
    );
  }

  return (
    <section className="py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : (
        <>
          {orders.slice(0, visibleCount).map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="border-0 shadow-lg mb-3"
                style={{ borderRadius: 14 }}
              >
                {/* Card Header - Order info */}
                <Card.Header
                  className="d-flex justify-content-between align-items-center py-3"
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "14px 14px 0 0",
                  }}
                >
                  <div>
                    <span
                      className="fw-bold small"
                      style={{ color: "var(--primary)" }}
                    >
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-muted small ms-3">
                      {new Date(order.createdAt).toLocaleDateString("en-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge
                      bg={statusColor[order.status]}
                      className="rounded-pill px-3 py-2 text-capitalize"
                    >
                      {order.status}
                    </Badge>
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        className="rounded-pill"
                        onClick={() => handleCancel(order._id)}
                      >
                        <FiX className="me-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </Card.Header>

                {/* Card Body - Products */}
                <Card.Body className="p-0">
                  {order.items?.map((item, i) => (
                    <div
                      key={item._id || `${order._id}-${i}`}
                      className="d-flex align-items-center gap-3 p-3"
                      style={{
                        borderBottom:
                          i < order.items.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                      }}
                    >
                      {/* Product image */}
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product?.name}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 10,
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 70,
                            height: 70,
                            background: "#F0FAF4",
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            flexShrink: 0,
                          }}
                        >
                          🧴
                        </div>
                      )}

                      {/* Product info */}
                      <div className="flex-grow-1">
                        <div
                          className="fw-semibold"
                          style={{
                            color: "var(--primary)",
                            fontFamily: "bold",
                          }}
                        >
                          {item.product?.name || "Unknown Product"} ×{" "}
                          {item.quantity}
                        </div>
                      </div>

                      {/* Item price */}
                      <div
                        className="fw-bold text-end"
                        style={{ color: "var(--primary)", fontFamily: "bold" }}
                      >
                        EGP {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div
                    className="d-flex justify-content-between align-items-center px-3 py-2"
                    style={{
                      borderRadius: "0 0 14px 14px",
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <span className="small text-muted">
                      {order.paymentMethod} • {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </span>
                    <span
                      className="fw-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      Total: EGP {order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
          {/* SEE MORE BUTTON */}
          {visibleCount < orders.length && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                See more orders
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
