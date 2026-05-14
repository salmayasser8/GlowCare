"use client";
import { useState, useEffect } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { RoleButton } from "@/app/components/roleButton";
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords don't match");
    if (form.password.length < 8)
      return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (success) {
      toast(
        <div className="text-center">
          <h2>Check your email! ✉️</h2>
          <p>
            We sent a verification link to <strong>{form.email}</strong>
          </p>
        </div>,
        {
          duration: 4000,
        },
      );

      const timer = setTimeout(() => {
        toast.dismiss();
        router.push("/login");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [success]);
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className=" col-md-8 col-lg-6">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-3">Welcome to GlowCare</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 w-75 mx-auto ">
                  <div className="d-flex gap-3">
                    <RoleButton
                      value="customer"
                      label="Customer"
                      Icon={FaShoppingBag}
                      form={form}
                      setForm={setForm}
                      required
                    />
                    <RoleButton
                      value="seller"
                      label="Seller"
                      Icon={FaStore}
                      form={form}
                      setForm={setForm}
                      required
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className=" eye position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3"
                    >
                      {showPassword ? (
                        <FiEyeOff color="var(--primary)" />
                      ) : (
                        <FiEye color="var(--primary)" />
                      )}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading}
                  className="fw-bold w-50 mx-auto d-block rounded-pill p-2"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Form>

              <p className="mt-3 text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
