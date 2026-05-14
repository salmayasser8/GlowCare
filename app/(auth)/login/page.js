"use client";
import { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      setToken(data.accessToken);
      setUser(data.user);
      toast.success(`Welcome, ${data.user.name}!`);
      if (data.user.role === "admin") router.push("/admin");
      else if (data.user.role === "seller") router.push("/seller");
      else router.push("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className=" col-md-8 col-lg-5">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-3">Hello,Welcome Back</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 ">
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter Your Password"
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

                <Button
                  type="submit"
                  disabled={loading}
                  className=" fw-bold w-50 mx-auto d-block rounded-pill p-2 "
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" /> Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Form>

              <p className="mt-3 text-center">
                Don't have an account? <Link href="/register">Sign Up</Link>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}
