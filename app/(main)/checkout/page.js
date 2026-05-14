"use client";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Riple } from "react-loading-indicators";
import { FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoMdCash } from "react-icons/io";
import { FaRegCreditCard } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";

export default function CheckoutPage() {
  const { user, token, mounted } = useAuth("customer");
  const { cart, setCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    street: "",
    city: "",
    country: "Egypt",
    paymentMethod: "cash on delivery",
  });

  useEffect(() => {
    if (!mounted) return;
    if (!token) return;

    const loadCart = async () => {
      if (cart?.items?.length > 0) {
        setInitialLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/cart");
        setCart(data.cart);
        if (!data.cart?.items?.length) {
          router.push("/cart");
        } else {
          setInitialLoading(false);
        }
      } catch (err) {
        console.error(err);
        router.push("/cart");
      }
    };

    loadCart();
  }, [mounted, token]);

  if (!mounted || initialLoading) {
    return (
      <section className="py-5 text-center">
        <Riple color="var(--primary)" size="medium" text="" textColor="" />
      </section>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + item.product?.price * item.quantity,
      0,
    ) || 0;

  const handlePlaceOrder = async () => {
    if (!form.street || !form.city) {
      toast.error("Please fill in your address");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/order", {
        paymentMethod: form.paymentMethod,
        shippingAddress: {
          street: form.street,
          city: form.city,
          country: form.country,
        },
      });

      // if stripe payment
      if (form.paymentMethod === "credit card") {
        const { data: paymentData } = await api.post("/payment/intent", {
          orderId: data.order._id,
        });
        // redirect to stripe payment page
        router.push(
          `/checkout/payment?clientSecret=${paymentData.clientSecret}&orderId=${data.order._id}`,
        );
        return;
      }

      // cash on delivery
      setCart({ items: [] });
      setStep(3); // show success
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Success step
  if (step === 3) {
    return (
      <Container className="py-5 text-center">
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#D1FAE5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <FiCheck size={36} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="fw-bold">Order Placed! 🎉</h2>
        <p className="text-muted mb-4">
          Thank you for your order! Check your email for confirmation.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Button
            className="rounded-pill px-4"
            onClick={() => router.push("/orders")}
          >
            View My Orders
          </Button>
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4"
            onClick={() => router.push("/products")}
          >
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <Row className="g-4">
        {/* Left - Form */}
        <Col lg={7}>
          {/* Shipping Address */}
          <Card
            className="border-0 shadow-sm mb-4"
            style={{ borderRadius: 12 }}
          >
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FiMapPin style={{ color: "var(--primary)" }} /> Shipping
                Address
              </h5>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                      placeholder="123 Main St, Apt 4"
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
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FiCreditCard style={{ color: "var(--primary)" }} /> Payment
                Method
              </h5>
              <Row className="g-3">
                {[
                  {
                    value: "cash on delivery",
                    label: " Cash on Delivery",
                    icon: <IoMdCash size={20} />,
                  },
                  {
                    value: "credit card",
                    label: " Credit Card ",
                    icon: <FaRegCreditCard size={20} />,
                  },
                  {
                    value: "wallet",
                    label: " Wallet",
                    icon: <LuWallet size={20} />,
                  },
                ].map((method) => (
                  <Col md={4} key={method.value}>
                    <div
                      onClick={() =>
                        setForm({ ...form, paymentMethod: method.value })
                      }
                      style={{
                        height: "100%",
                        border: `2px solid ${form.paymentMethod === method.value ? "#2D6A4F" : "#E8E2D9"}`,
                        borderRadius: 8,
                        padding: "1rem",
                        cursor: "pointer",
                        background:
                          form.paymentMethod === method.value
                            ? "#F0FAF4"
                            : "#fff",
                        textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        className="fw-semibold small d-flex align-items-center justify-content-center gap-2"
                        style={{ color: "var(--primary)" }}
                      >
                        {method.icon} {method.label}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Right - Order Summary */}
        <Col lg={5}>
          <Card className="border-0 shadow-lg" style={{ borderRadius: 12 }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              {/* Items */}
              <div className="mb-3">
                {cart?.items?.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between mb-2"
                  >
                    <span className=" small">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="small fw-semibold">
                      EGP {(item.product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span className="fw-semibold">EGP {totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className=" fw-semibold">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold  fs-5">
                  EGP {totalPrice.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-100 rounded-pill py-2 fw-bold"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" /> Placing order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
