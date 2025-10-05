import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:info@limkokwing.ac?subject=Message from ${email}&body=${message}`;
  };

  // Scroll animation for form & icons
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const styles = {
    page: {
      backgroundColor: "#000000",
      minHeight: "100vh",
      padding: "80px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#f2f2f2",
      textAlign: "center",
    },
    heading: {
      fontSize: "2.8rem",
      marginBottom: "40px",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    iconContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      marginBottom: "50px",
    },
    formCard: {
      backgroundColor: "#111",
      padding: "40px 30px",
      borderRadius: "20px",
      maxWidth: "500px",
      margin: "0 auto",
      boxShadow: "0 6px 25px rgba(255,255,255,0.05)",
      transition: "transform 0.4s ease, box-shadow 0.4s ease, opacity 1s ease",
    },
    input: {
      padding: "12px 15px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#222",
      color: "#f2f2f2",
      fontSize: "1rem",
      outline: "none",
      marginBottom: "20px",
    },
    textarea: {
      padding: "12px 15px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#222",
      color: "#f2f2f2",
      fontSize: "1rem",
      outline: "none",
      minHeight: "140px",
      marginBottom: "20px",
    },
    button: {
      padding: "15px",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      color: "#000",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "transform 0.3s ease",
    },
    buttonHover: {
      transform: "translateY(-2px)",
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .fade-in.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(255,255,255,0.1);
        }
        .social-icon:hover {
          transform: scale(1.2);
          transition: transform 0.3s ease;
        }
      `}</style>

      <h1 style={styles.heading} className="fade-in">Contact Us</h1>

      <div style={styles.iconContainer} className="fade-in">
        <FaWhatsapp size={35} color="#25D366" className="social-icon" />
        <FaFacebook size={35} color="#1877F2" className="social-icon" />
        <FaTwitter size={35} color="#1DA1F2" className="social-icon" />
        <FaEnvelope size={35} color="#EA4335" className="social-icon" />
      </div>

      <div style={styles.formCard} className="form-card fade-in">
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            style={styles.textarea}
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
