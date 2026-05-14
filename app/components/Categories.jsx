"use client";
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const Categories = ({ categories, id }) => {
  if (!categories.length) return null;

  const skinCats = categories.filter((c) => c.type === "skin");
  const hairCats = categories.filter((c) => c.type === "hair");

  const renderGroup = (label, items, type) => {
    if (!items.length) return null;
    return (
      <section className="mb-5" id={id}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">{label}</h5>
          <Link
            href={`/products?type=${type}`}
            className="text-success text-decoration-none small fw-bold"
          >
            View all <FiArrowRight size={13} />
          </Link>
        </div>
        <Row className="g-2">
          {items.map((cat, index) => (
            <Col key={cat._id} xs={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                // ↑ each card animates 0.1s after the previous one
              >
                <Link
                  href={`/products?category=${cat._id}`}
                  className="text-decoration-none"
                >
                  <Card
                    className="text-center border-0 h-100"
                    style={{
                      borderRadius: 12,
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <Card.Body className="py-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 8,
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "2.5rem" }}>🌱</span>
                      )}
                      <div
                        className="mt-2 small"
                        style={{ color: "#2D6A4F", fontFamily: "bold" }}
                      >
                        {cat.name}
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  return (
    <section className="py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-0">Shop by Category</h2>
      </div>
      {renderGroup("Skin Care", skinCats, "skin")}
      {renderGroup("Hair Care", hairCats, "hair")}
    </section>
  );
};

export default Categories;
