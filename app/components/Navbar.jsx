"use client";
import { useState, useEffect } from "react";
import { Navbar, Nav, Badge, Dropdown, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiLogOut,
  FiPackage,
  FiSettings,
} from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/axios";
import toast from "react-hot-toast";
export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, token, logout, setUser } = useAuthStore();
  const { cart } = useCartStore();
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  useEffect(() => {
    setMounted(true);
    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const { data } = await api.get("/user/profile");
          setUser(data.user);
        } catch {
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" className=" px-3  shadow-sm">
      <Navbar.Brand as={Link} href="/" className="fs-4">
        🌿 GlowCare
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="main-nav" className="" />

      <Navbar.Collapse
        id="main-nav"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <Nav className="mx-auto gap-2 fs-5 ">
          <Nav.Link as={Link} href="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} href="/products">
            Products
          </Nav.Link>
          <Nav.Link as={Link} href="#categories">
            Categories
          </Nav.Link>
          <Nav.Link as={Link} href="#about">
            About Us
          </Nav.Link>
          {user?.role === "seller" && (
            <Nav.Link as={Link} href="/seller">
              Dashboard
            </Nav.Link>
          )}
          {user?.role === "admin" && (
            <Nav.Link as={Link} href="/admin">
              Admin Panel
            </Nav.Link>
          )}
        </Nav>

        <Nav className="align-items-start align-items-lg-center gap-3">
          {!token ? (
            <>
              <Nav.Link as={Link} href="/login">
                Login
              </Nav.Link>
              <Link href="/register">
                <Button className=" rounded-pill px-3">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              {user?.role === "customer" && (
                <Nav.Link as={Link} href="/cart" className="position-relative">
                  <FiShoppingCart size={25} />
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-25 start-100 translate-middle"
                      style={{ fontSize: "0.6rem" }}
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-3 d-flex align-items-center gap-2 fw-bold "
                >
                  <FiUser size={16} />
                  {user?.name?.split(" ")[0]}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>{user?.email}</Dropdown.Header>
                  <Dropdown.Divider />

                  {/* Profile - for everyone */}
                  <Dropdown.Item as={Link} href="/profile">
                    <FiUser size={14} className="me-2" /> Profile
                  </Dropdown.Item>

                  {/* Customer only */}
                  {user?.role === "customer" && (
                    <>
                      <Dropdown.Item as={Link} href="/orders">
                        <FiPackage size={14} className="me-2" /> My Orders
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} href="/wishlist">
                        <FiHeart size={14} className="me-2" /> Wishlist
                      </Dropdown.Item>
                    </>
                  )}

                  {/* Seller only */}
                  {user?.role === "seller" && (
                    <Dropdown.Item as={Link} href="/seller">
                      <FiSettings size={14} className="me-2" /> Dashboard
                    </Dropdown.Item>
                  )}

                  {/* Admin only */}
                  {user?.role === "admin" && (
                    <Dropdown.Item as={Link} href="/admin">
                      <FiSettings size={14} className="me-2" /> Admin Panel
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FiLogOut size={14} className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
