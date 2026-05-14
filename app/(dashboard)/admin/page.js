"use client";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import api from "@/lib/axios";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, mounted } = useAuth("admin");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  useEffect(() => {
    if (!mounted) return;
    fetchAll();
  }, [mounted]);

  if (!mounted) return null;

  const fetchAll = async () => {
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        api.get("/admin"),
        api.get("/order"),
        api.get("/products"),
      ]);
      setUsers(usersRes.data.users);
      setOrders(ordersRes.data.orders);
      setProducts(productsRes.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await api.patch(`/admin/${id}`);
      toast.success("User status updated!");
      fetchAll();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/order/${id}`, { status });
      toast.success("Order status updated!");
      fetchAll();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const statusColor = {
    pending: "warning",
    confirmed: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted">Welcome, {user?.name}!</p>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {[
          {
            icon: <FiUsers size={24} />,
            label: "Total Users",
            value: users.length,
            color: "#F0FAF4",
          },
          {
            icon: <FiPackage size={24} />,
            label: "Total Products",
            value: products.length,
            color: "#FFF9F0",
          },
          {
            icon: <FiShoppingBag size={24} />,
            label: "Total Orders",
            value: orders.length,
            color: "#F0F4FF",
          },
          {
            icon: <FiShoppingBag size={24} />,
            label: "Pending Orders",
            value: orders.filter((o) => o.status === "pending").length,
            color: "#FFF0F0",
          },
        ].map((stat, index) => (
          <Col md={3} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <Card
                className="border-0 shadow-sm text-center p-3 h-100"
                style={{ background: stat.color, borderRadius: 12 }}
              >
                <div style={{ color: "#2D6A4F" }}>{stat.icon}</div>
                <h4 className="fw-bold mt-2 mb-1">{stat.value}</h4>
                <p className="text-muted small mb-0">{stat.label}</p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : (
        <Tabs
          defaultActiveKey="users"
          className="mt-5"
          onSelect={(k) => setActiveTab(k)}
        >
          {/* Users Tab */}
          <Tab
            eventKey="users"
            className="text-success"
            title={`Users (${users.length})`}
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <table className="table table-hover mb-0">
                        <thead style={{ background: "#F8F9FA" }}>
                          <tr>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3">Role</th>
                            <th className="py-3">Status</th>
                            <th className="py-3">Joined</th>
                            <th className="py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u._id}>
                              <td className="py-3 px-4">
                                <div className="fw-semibold">{u.name}</div>
                                <div className="small text-muted">
                                  {u.email}
                                </div>
                              </td>
                              <td className="py-3">
                                <Badge className="rounded-pill text-capitalize">
                                  {u.role}
                                </Badge>
                              </td>
                              <td className="py-3">
                                <Badge
                                  //   bg={u.isActive ? "success" : "red"}
                                  className="rounded-pill"
                                >
                                  {u.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="py-3 small text-muted">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3">
                                {u.role !== "admin" && (
                                  <Button
                                    size="sm"
                                    style={{
                                      backgroundColor: u.isActive
                                        ? "#2d6a4f"
                                        : "#9B0F06",
                                      border: "none",
                                    }}
                                    className=" status rounded-pill"
                                    onClick={() => handleToggleUser(u._id)}
                                  >
                                    {u.isActive ? (
                                      <>
                                        <FiToggleLeft
                                          size={20}
                                          className="me-1 mb-1"
                                        />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <FiToggleRight
                                          size={20}
                                          className="me-1 mb-1"
                                        />
                                        Activate
                                      </>
                                    )}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Tab>

          {/* Orders Tab */}
          <Tab eventKey="orders" title={`Orders (${orders.length})`}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: "#F8F9FA" }}>
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3">Customer</th>
                        <th className="py-3">Total</th>
                        <th className="py-3">Payment</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td
                            className="py-3 px-4 small "
                            style={{ color: "var(--primary)" }}
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td
                            className="py-3 small"
                            style={{ color: "var(--primary)" }}
                          >
                            {order.user?.name || "—"}
                          </td>
                          <td className="py-3 fw-semibold text-success">
                            EGP {order.totalPrice?.toFixed(2)}
                          </td>
                          <td className="py-3 small text-muted text-capitalize">
                            {order.paymentMethod?.replace("_", " ")}
                          </td>
                          <td className="py-3">
                            <Badge
                              bg={statusColor[order.status]}
                              className="rounded-pill text-capitalize"
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <select
                              className="form-select form-select-sm rounded-pill"
                              style={{ width: "auto" }}
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(
                                  order._id,
                                  e.target.value,
                                )
                              }
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {/* Products Tab */}
          <Tab eventKey="products" title={`Products (${products.length})`}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: "#F8F9FA" }}>
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3">Category</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Stock</th>
                        <th className="py-3">Seller</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="py-3 px-4">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                style={{
                                  width: 35,
                                  height: 35,
                                  borderRadius: 6,
                                  background: "#F0FAF4",
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  "🧴"
                                )}
                              </div>
                              <span className="fw-semibold small">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 small">
                            {product.category?.name}
                          </td>
                          <td className="py-3 small fw-semibold">
                            EGP {product.price}
                          </td>
                          <td
                            className="py-3 small"
                            style={{
                              color:
                                product.stock === 0
                                  ? "#DC3545"
                                  : product.stock < 5
                                    ? "#FFA500"
                                    : "#2D6A4F",
                            }}
                          >
                            {product.stock}
                          </td>
                          <td className="py-3 small">{product.seller?.name}</td>
                          <td className="py-3">
                            <Badge
                              bg={product.isActive ? "success" : "secondary"}
                              className="rounded-pill"
                            >
                              {product.isActive ? "Active" : "Hidden"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}
