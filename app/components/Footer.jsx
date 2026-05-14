import Link from "next/link";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="  pt-5 pb-3 mt-5">
      <div className="row g-4 justify-content-center ">
        {/* Brand */}
        <div className="col-md-4 text-center text-md-start">
          <h5 className="fw-bold mb-3">🌿 GlowCare</h5>
          <p className=" small fw-bold">
            Your premium destination for natural skincare & haircare products.
            Glow from the inside out.
          </p>
          {/* Social Media */}
          <div className="d-flex gap-3 mt-3 justify-content-center justify-content-md-start">
            <a href="#" className="fs-5">
              <FiInstagram />
            </a>
            <a href="#" className="fs-5">
              <FiTwitter />
            </a>
            <a href="#" className="fs-5">
              <FiFacebook />
            </a>
            <a href="mailto:support@glowcare.com" className=" fs-5">
              <FiMail />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div className="col-md-2 text-center text-md-start">
          <h6 className="fw-bold mb-3">Shop</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link href="/products" className=" text-decoration-none small">
                All Products
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/products?category=moisturizers"
                className="text-decoration-none small"
              >
                Moisturizers
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/products?category=serums"
                className=" text-decoration-none small"
              >
                Serums
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/products?category=sunscreen"
                className=" text-decoration-none small"
              >
                Sunscreen
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/products?category=haircare"
                className=" text-decoration-none small"
              >
                Haircare
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="col-md-2 text-center text-md-start">
          <h6 className="fw-bold mb-3">Account</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <Link href="/login" className=" text-decoration-none small">
                Login
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/register" className=" text-decoration-none small">
                Register
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/orders" className=" text-decoration-none small">
                My Orders
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/wishlist" className=" text-decoration-none small">
                Wishlist
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/profile" className=" text-decoration-none small">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div className="col-md-2 text-center text-md-start">
          <h6 className="fw-bold mb-3">Help</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="#" className=" text-decoration-none small">
                FAQ
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className=" text-decoration-none small">
                Shipping Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className=" text-decoration-none small">
                Return Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className=" text-decoration-none small">
                Privacy Policy
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className=" text-decoration-none small">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-md-2 text-center text-md-start">
          <h6 className="fw-bold mb-3">Contact</h6>
          <ul className="list-unstyled">
            <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <FiPhone size={14} className="flex-shrink-0" />
              <span className="small">+20 1270862682</span>
            </li>
            <li className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <FiMapPin size={14} className="" />
              <span className="small">Cairo, Egypt</span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-secondary mt-4" />

      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="small mb-0">© 2025 GlowCare. All rights reserved.</p>
        </div>
        <div className="col-md-6 text-md-end">
          <span className="small">Made with ❤️ in Egypt</span>
        </div>
      </div>
    </footer>
  );
}
