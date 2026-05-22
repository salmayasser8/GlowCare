# 🌿 GlowCare — Premium Skincare & Haircare E-Commerce Platform

A full-stack e-commerce web application built with **Next.js 14** (App Router), featuring a complete shopping experience for skincare and haircare products with three distinct user roles: Customer, Seller, and Admin.

---

## 🚀 Live Demo

https://github.com/salmayasser8/GlowCare

---

## ✨ Features

### 👤 Authentication
- Email & password registration with email verification
- JWT-based authentication with secure token storage
- Role-based access control (Customer / Seller / Admin)
- Password change functionality
- Account activation/deactivation (soft delete)

### 🛍️ Customer
- Browse all products with search, category filter, and price range filter
- View detailed product pages with reviews and ratings
- Add products to cart with quantity management
- Save products to wishlist
- Secure checkout with multiple payment methods
- Order tracking with status updates
- Profile management with address book
- Leave reviews and star ratings on purchased products

### 🏪 Seller
- Dedicated seller dashboard
- Add, edit, and delete products
- Mark products as featured on homepage
- Real-time stock management
- Low stock indicators

### 🔧 Admin
- Full user management (activate/deactivate accounts)
- Complete order management with status updates
- Product oversight across all sellers
- Category management (create, update, delete)
- Newsletter subscriber management

### 💳 Payment
- Stripe credit card integration
- Cash on delivery
- Wallet payment option

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with SSR |
| React Bootstrap | UI components |
| Framer Motion | Animations and transitions |
| Zustand | State management (auth, cart) |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| React Icons | Icon library |
| React Loading Indicators | Loading states |
| js-cookie | Token storage |
| @stripe/react-stripe-js | Stripe payment UI |

### Backend
| Technology | Purpose |
|---|---|
| Next.js API Routes | Serverless backend |
| MongoDB + Mongoose | Database |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| Nodemailer | Email verification & order confirmation |
| Stripe | Payment processing |
| Cloudinary | Image storage (optional) |

---

## 📁 Project Structure

```
glowcare/
├── app/
│   ├── (auth)/                 # Login & Register pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                 # Main shop pages
│   │   ├── page.js             # Homepage
│   │   ├── products/           # Products listing & details
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout & payment
│   │   ├── orders/             # Order history
│   │   ├── profile/            # User profile
│   │   └── wishlist/           # Saved products
│   ├── (dashboard)/            # Role dashboards
│   │   ├── seller/             # Seller dashboard
│   │   └── admin/              # Admin panel
│   └── api/                    # API routes
│       ├── auth/               # Register, login, verify
│       ├── products/           # Product CRUD
│       ├── category/           # Category management
│       ├── cart/               # Cart operations
│       ├── order/              # Order management
│       ├── reviews/            # Product reviews
│       ├── user/               # Profile, wishlist, password
│       ├── admin/              # Admin operations
│       ├── payment/            # Stripe integration
│       └── newsletter/         # Newsletter subscriptions
├── components/                 # Reusable UI components
│   ├── NavBar.jsx
│   ├── Footer.jsx
│   ├── Categories.jsx
│   ├── FeaturedProducts.jsx
│   ├── ProductCard.jsx
│   ├── AboutUs.jsx
│   └── Newsletter.jsx
├── controllers/                # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── userController.js
│   ├── adminController.js
│   └── paymentController.js
├── models/                     # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Review.js
│   └── Subscriber.js
├── middlewares/
│   └── authMw.js               # JWT authentication middleware
├── store/
│   ├── authStore.js            # Zustand auth state
│   └── cartStore.js            # Zustand cart state
├── lib/
│   ├── mongodb.js              # Database connection
│   └── axios.js                # Axios instance with interceptors
├── hooks/
│   └── useAuth.js              # Auth protection hook
└── utils/
    ├── httpError.js            # Custom error class
    ├── sendEmail.js            # Email utilities
    └── checkRole.js            # Role validation helpers
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account
- Gmail account (for email verification)

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/salmayasser8/GlowCare.git
cd GlowCare
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env.local` file:**
```bash
# Database
MONGO_URL=mongodb://localhost:27017/glowcare

# JWT
JWT_ACCESS_TOKEN_SECRET=your_super_secret_key_here
JWT_ACCESS_TOKEN_EXP=7d

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**4. Run the development server:**
```bash
npm run dev
```

**5. Open** `http://localhost:3000`

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `JWT_ACCESS_TOKEN_SECRET` | Secret key for JWT signing |
| `JWT_ACCESS_TOKEN_EXP` | Token expiration (e.g. `7d`) |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `NEXT_PUBLIC_BASE_URL` | Your app URL |
| `STRIPE_SECRET_KEY` | Stripe secret key (backend) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (frontend) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

---

## 📧 Gmail App Password Setup

1. Go to your Google Account → Security
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Generate a new app password for "Mail"
5. Use this password as `EMAIL_PASS` in your `.env`

---

## 💳 Stripe Testing

Use these test card numbers:

| Card | Number |
|---|---|
| ✅ Success | `4242 4242 4242 4242` |
| ❌ Declined | `4000 0000 0000 0002` |

Use any future expiry date, any 3-digit CVC, any ZIP code.

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify/[token]` | Verify email |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products (with filters) |
| POST | `/api/products` | Create product (seller) |
| GET | `/api/products/[id]` | Get single product |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Soft delete product |
| GET | `/api/products/featured` | Get featured products |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart` | Update quantity |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/order` | Get orders (role-based) |
| POST | `/api/order` | Place order |
| PUT | `/api/order/[id]` | Update order status |
| DELETE | `/api/order/[id]` | Cancel order |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/password` | Change password |
| GET | `/api/user/wishlist` | Get wishlist |
| POST | `/api/user/wishlist` | Add to wishlist |
| DELETE | `/api/user/wishlist/[id]` | Remove from wishlist |

---

## 👥 User Roles

### Customer
- Browse and purchase products
- Manage cart and wishlist
- Track orders and leave reviews
- Update profile and address

### Seller
- Create and manage their own products
- Mark products as featured
- View their product statistics
- Update order status for their products

### Admin
- Manage all users (activate/deactivate)
- Manage all orders and update statuses
- Create and manage categories
- View all products across sellers
- Access complete platform statistics

> **Note:** Admin accounts are created directly in the database — not through the registration form (security best practice)

---

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub (without `.env` files)
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_BASE_URL` to your Vercel URL
5. Update Stripe webhook endpoint in Stripe Dashboard to your Vercel URL

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---
