"use client";
import { useState, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { BsCreditCardFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

// Card Form Component
function PaymentForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { setCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        },
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      if (paymentIntent.status === "succeeded") {
        setCart({ items: [] });
        toast.success("Payment successful! 🎉");
        router.push("/orders");
      }
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          border: "1px solid #E8E2D9",
          borderRadius: 8,
          padding: "1rem",
          marginBottom: "1.5rem",
          background: "#FDFCFB",
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1a1a1a",
                "::placeholder": { color: "#C4B8AD" },
              },
            },
          }}
        />
      </div>
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-100 rounded-pill py-2 fw-bold"
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" /> Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
}
// Main Page
export default function PaymentPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("clientSecret");
  const orderId = searchParams.get("orderId");
  if (!clientSecret) {
    return (
      <section className="py-5 text-center">
        <h3>Invalid payment session</h3>
      </section>
    );
  }
  return (
    <section className="py-5">
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 className="fw-bold mb-4 text-center">Complete Payment</h2>
        <Card className="border-0 shadow-lg" style={{ borderRadius: 12 }}>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <BsCreditCardFill size={50} color="var(--primary)" />
              <p className=" small mt-2">Your payment is secured by Stripe</p>
            </div>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm clientSecret={clientSecret} orderId={orderId} />
            </Elements>
            <p className=" small mt-3 d-flex align-items-center gap-2 justify-content-center">
              <FaLock color="var(--primary)" /> 256-bit SSL encryption
            </p>
          </Card.Body>
        </Card>
      </div>
    </section>
  );
}
