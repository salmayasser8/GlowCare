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
              className="btn btn-sm btn-danger rounded-pill"
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
              className="btn btn-sm btn-outline-secondary rounded-pill"
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
          <div className="d-flex flex-column gap-3">
            {orders.slice(0, visibleCount).map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  key={order._id}
                  className="border-0 shadow-lg "
                  style={{
                    borderRadius: 14,
                    transition: "all 0.2s ease",
                  }}
                >
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      {/* LEFT */}
                      <Col md={8}>
                        <div className="d-flex gap-2">
                          {order.items[0].product.image ? (
                            <img
                              src={order.items[0].product.image}
                              alt={order.items[0].product.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: 14,
                              }}
                            />
                          ) : (
                            <span>🧴</span>
                          )}
                          <div className="d-flex flex-column gap-1">
                            <div
                              className="small"
                              style={{ color: "var(--primary)" }}
                            >
                              Order #{order._id.slice(-8).toUpperCase()}
                            </div>

                            <div className="small">
                              {order.items?.slice(0, 2).map((item) => (
                                <span
                                  key={item._id}
                                  className="me-2 fw-semibold"
                                >
                                  {item.product?.name} × {item.quantity}
                                </span>
                              ))}
                            </div>

                            <div
                              className=" small mt-1"
                              style={{ color: "var(--primary)" }}
                            >
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-EG",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>

                      {/* RIGHT */}
                      <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <div className="d-flex flex-column align-items-md-end gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="rounded-pill"
                              onClick={() => handleCancel(order._id)}
                            >
                              <FiX className="me-1" /> Cancel
                            </Button>
                          )}
                          <Badge
                            bg={statusColor[order.status]}
                            className="rounded-pill px-3 py-2 text-capitalize"
                          >
                            {order.status}
                          </Badge>

                          <div
                            className="fw-bold  fs-6 mt-1"
                            style={{
                              color: "var(--primary)",
                              fontWeight: "bold",
                            }}
                          >
                            EGP {order.totalPrice?.toFixed(2)}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </div>

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
