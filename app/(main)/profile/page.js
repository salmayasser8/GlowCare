"use client";
import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Form, Badge, Spinner } from "react-bootstrap";
import { FiUser, FiLock, FiSave } from "react-icons/fi";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import useAuth from "@/app/hooks/useAuth";
import toast from "react-hot-toast";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
export default function ProfilePage() {
  const { mounted } = useAuth();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    country: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!mounted || !user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      street: user.address?.street || "",
      city: user.address?.city || "",
      country: user.address?.country || "",
    });
  }, [mounted, user]);
  useEffect(() => {
    if (!mounted) return;
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/user/profile");
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [mounted]);
  if (!mounted) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/user/profile", {
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          country: form.country,
        },
      });
      setUser(data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/user/password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <section className="py-5">
        <h2 className="fw-bold mb-4">My Profile</h2>
        <Row className="g-4">
          {/* Profile Info */}
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                className="border-0 shadow-sm mb-4"
                style={{ borderRadius: 12 }}
              >
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FiUser color="var(--primary)" /> Personal Information
                  </h5>
                  <Form onSubmit={handleUpdateProfile}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="01xxxxxxxxx"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            placeholder="123 Main St"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Cairo"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Egypt"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      type="submit"
                      className="rounded-pill px-4 mt-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" /> Saving Changes...
                        </>
                      ) : (
                        <>
                          <FiSave className="me-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <FiLock color="var(--primary)" /> Change Password
                  </h5>
                  <Form onSubmit={handleChangePassword}>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Min. 8 characters"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Repeat new password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      type="submit"
                      className="rounded-pill px-4 mt-3"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <>
                          <Spinner size="sm" /> Changing Password...
                        </>
                      ) : (
                        <>Change Password</>
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Right - User Info Card */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card
                className="border-0 shadow-lg text-center p-4"
                style={{ borderRadius: 12 }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#F0FAF4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "2rem",
                  }}
                >
                  <FaUser color="var(--primary)" />
                </div>
                <h5 className="fw-bold">{user?.name}</h5>
                <p className="text-muted small">{user?.email}</p>
                <Badge className="rounded-pill p-2 text-capitalize w-50 mx-auto fs-6">
                  {user?.role}
                </Badge>
                <hr />
                <div className="text-start" style={{ color: "var(--primary)" }}>
                  <div className="small mb-1 d-flex align-items-center gap-2">
                    <FaPhoneAlt /> {user?.phone || "Not added"}
                  </div>
                  <div className="small d-flex align-items-center gap-2">
                    <FaLocationDot /> {user?.address?.city || "Not added"}
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </section>
    </motion.div>
  );
}
