"use client";
import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Badge, Modal } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiPackage,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAuth from "@/app/hooks/useAuth";

export default function Seller() {
  const { user, token, mounted } = useAuth("seller");
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  useEffect(() => {
    if (!mounted) return;
    fetchMyProducts();
    fetchCategories();
  }, [mounted]);

  const fetchMyProducts = async () => {
    try {
      const { data } = await api.get("/products");
      // filter only seller's own products
      const myProducts = data.products.filter(
        (p) => p.seller?._id === user?._id || p.seller === user?._id,
      );
      setProducts(myProducts);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, form);
        toast.success("Product updated!");
      } else {
        await api.post("/products", form);
        toast.success("Product added!");
      }
      setShowModal(false);
      setEditProduct(null);
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
      fetchMyProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category,
      image: product.image,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchMyProducts();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
    setShowModal(true);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Your Dashboard</h2>
          <p className=" mb-0">Welcome, {user?.name}!</p>
        </div>
        <Button
          onClick={openAddModal}
          style={{ background: "var(--bg-btn)", border: "none" }}
          className="rounded-pill px-4"
        >
          <FiPlus className="me-2" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <Row
        className="g-3 mb-4 align-items-stretch"
        style={{ fontFamily: "bold" }}
      >
        {[
          {
            icon: (
              <FiPackage
                size={24}
                color="var(--primary)"
                className="mx-auto mb-2"
              />
            ),
            label: "Total Products",
            value: products.length,
            bg: "var(--bg-card)",
          },
          {
            icon: (
              <FiAlertTriangle
                size={24}
                color="#FFC107"
                className="mx-auto mb-2"
              />
            ),
            label: "Low Stock",
            value: products.filter((p) => p.stock < 5).length,
            bg: "var(--bg-card)",
          },
          {
            icon: (
              <FiCheckCircle
                size={24}
                color="#0d6efd"
                className="mx-auto mb-2"
              />
            ),
            label: "Active Products",
            value: products.filter((p) => p.isActive).length,
            bg: "var(--bg-card)",
          },
        ].map((stat, index) => (
          <Col md={4} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <Card
                className="border-0 shadow-sm text-center p-3 h-100"
                style={{ background: stat.bg, borderRadius: 12 }}
              >
                {stat.icon}
                <h4 className="fw-bold mt-2">{stat.value}</h4>
                <p className="text-muted small mb-0">{stat.label}</p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
      {/* <Col md={4}> */}
      {/* <Card
            className="border-0 shadow-sm text-center p-3 "
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <FiAlertTriangle
              size={24}
              color="var(--primary)"
              className="mx-auto mb-2"
            />
            <h4
              className="fw-bold"
              style={{
                color:
                  products.filter((p) => p.stock < 5).length > 0
                    ? "red"
                    : "var(--primary)",
              }}
            >
              {products.filter((p) => p.stock < 5).length}
            </h4>
            <p className="text-muted small mb-0">Low Stock</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="border-0 shadow-sm text-center p-3 "
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <FiCheckCircle
              size={24}
              color="var(--primary)"
              className="mx-auto mb-2"
            />
            <h4 className="fw-bold ">
              {products.filter((p) => p.isActive).length}
            </h4>
            <p className=" small mb-0">Active Products</p>
          </Card>
        </Col> */}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-5">
          <Riple color="var(--primary)" size="medium" text="" textColor="" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <FiPackage size={48} color="var(--primary)" className="mb-3" />
            <h5>No products yet</h5>
            <Button
              onClick={openAddModal}
              style={{ background: "var(--bg-btn)", border: "none" }}
              className="rounded-pill mt-2"
            >
              Add your first product
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead
                  style={{
                    background: "var(--bg-card)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <tr>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Stock</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 8,
                              background: "var(--bg-card)",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
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
                              <span>🧴</span>
                            )}
                          </div>
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <div className="small text-muted">
                              {product.description?.slice(0, 30)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{product.category?.name || "—"}</td>
                      <td className="py-3 fw-semibold">EGP {product.price}</td>
                      <td className="py-3">
                        <span
                          style={{
                            color:
                              product.stock === 0
                                ? "red" // red = out of stock
                                : product.stock < 5
                                  ? "orange" // orange = low stock
                                  : "var(--primary)", // green = good stock
                            fontWeight: product.stock < 5 ? "bold" : "normal",
                          }}
                        >
                          {product.stock === 0 ? "Out of stock" : product.stock}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          bg={product.isActive ? "success" : "secondary"}
                          className="rounded-pill p-2 "
                        >
                          {product.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="d-flex  justify-content-center  align-items-center gap-2">
                          <FiEdit
                            size={20}
                            onClick={() => handleEdit(product)}
                            style={{
                              cursor: "pointer",
                              color: "var(--bg-primary)",
                            }}
                          />
                          <FiTrash
                            size={20}
                            onClick={() => handleDelete(product._id)}
                            style={{
                              cursor: "pointer",
                              color: "var(--bg-primary)",
                            }}
                          />
                          {/* </Button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Vitamin C Serum"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price (EGP)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  label="Feature this product on homepage"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                className="rounded-pill"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ background: "#2D6A4F", border: "none" }}
                className="rounded-pill px-4"
              >
                {editProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
