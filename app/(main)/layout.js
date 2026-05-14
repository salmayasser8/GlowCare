"use client";
import NavBar from "../components/Navbar";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
export default function MainLayout({ children }) {
  return (
    <>
      <Container style={{ backgroundColor: "var(--bg-card)" }} className="p-0">
        <NavBar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="px-3"
        >
          {children}
        </motion.main>
        {/* <Footer /> */}
      </Container>
    </>
  );
}
