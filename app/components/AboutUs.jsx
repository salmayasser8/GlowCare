import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FiCheckCircle, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
const AboutUs = ({ id }) => {
  return (
    <>
      <h2 className="fw-bold text-center mb-2">Why GlowCare?</h2>
      <section className="py-5" id={id}>
        <Row className="g-4 justify-content-center">
          {[
            {
              icon: <FiCheckCircle />,
              title: "Carefully Selected",
              desc: "We offer a curated collection of skincare and haircare products from trusted brands",
            },
            {
              icon: <FaStar />,
              title: "Beauty For Everyone",
              desc: "Discover premium products for every skin type and hair concern in one place",
            },
            {
              icon: <FiShoppingCart />,
              title: "Easy Shopping",
              desc: "Enjoy a smooth shopping experience with secure checkout and simple browsing",
            },
            {
              icon: <FaTruck />,
              title: "Fast Delivery",
              desc: "Get your favorite beauty products delivered quickly and safely to your doorstep",
            },
          ].map((item) => (
            <Col key={item.title} md={4} sm={6} lg={3}>
              <Card
                className="text-center border-0 h-100 p-3 about-card"
                style={{
                  borderRadius: 12,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <div style={{ fontSize: "2.5rem", color: "#2D6A4F" }}>
                    {item.icon}
                  </div>
                  <h6
                    className="fw-bold mt-3 mb-2 "
                    style={{ color: "#2D6A4F", fontSize: "1rem" }}
                  >
                    {item.title}
                  </h6>
                  <div className="d-flex flex-column justify-content-center flex-grow-1 w-100">
                    <p
                      className="text-muted small mb-0 text-center mx-auto"
                      style={{
                        //   display: "-webkit-box",
                        //   WebkitLineClamp: 3,
                        //   WebkitBoxOrient: "vertical",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        minHeight: "4.5em" /* approximately 3 lines */,
                        fontSize: "1rem",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default AboutUs;
