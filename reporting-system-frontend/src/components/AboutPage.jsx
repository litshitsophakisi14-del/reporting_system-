import React, { useEffect } from "react";

const AboutPage = () => {
  // Scroll animation effect
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
      marginBottom: "20px",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    paragraph: {
      fontSize: "1.15rem",
      lineHeight: "1.8",
      marginBottom: "25px",
      color: "#ccc",
      maxWidth: "850px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    features: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
      marginTop: "50px",
    },
    featureCard: {
      backgroundColor: "#111",
      borderRadius: "15px",
      padding: "25px",
      width: "280px",
      color: "#ccc",
      cursor: "pointer",
    },
    featureHeading: {
      fontSize: "1.3rem",
      marginBottom: "15px",
      color: "#4ca1af",
    },
    featureText: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#ccc",
    },
    footer: {
      marginTop: "60px",
      padding: "20px 0",
      borderTop: "1px solid #222",
      color: "#777",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.page}>
      {/* Internal CSS for hover & animations */}
      <style>{`
        .feature-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease, opacity 1s ease, transform 1s ease;
          opacity: 0;
          transform: translateY(20px);
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 6px 25px rgba(255,255,255,0.1);
        }
        .fade-in.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      <h1 style={styles.heading} className="fade-in">About Limkokwing University Lesotho</h1>
      <p style={styles.paragraph} className="fade-in">
        Limkokwing University Lesotho is a hub of creativity, innovation, and global learning.
        We empower students to become leaders and innovators in the 21st century.
      </p>
      <p style={styles.paragraph} className="fade-in">
        Our vision is to nurture talent through hands-on experience, real-world projects, 
        and a global perspective that prepares students for international opportunities.
      </p>

      <div style={styles.features}>
        <div className="feature-card fade-in" style={styles.featureCard}>
          <h2 style={styles.featureHeading}>🎨 Creative Programs</h2>
          <p style={styles.featureText}>
            Cutting-edge courses in design, media, technology, and business to unleash your creative potential.
          </p>
        </div>

        <div className="feature-card fade-in" style={styles.featureCard}>
          <h2 style={styles.featureHeading}>🌍 International Exposure</h2>
          <p style={styles.featureText}>
            Collaborate with a diverse student body and access global opportunities through our network.
          </p>
        </div>

        <div className="feature-card fade-in" style={styles.featureCard}>
          <h2 style={styles.featureHeading}>💡 Innovation & Technology</h2>
          <p style={styles.featureText}>
            Hands-on experience with the latest technologies and industry projects that fuel innovation.
          </p>
        </div>

        <div className="feature-card fade-in" style={styles.featureCard}>
          <h2 style={styles.featureHeading}>🎭 Vibrant Campus Life</h2>
          <p style={styles.featureText}>
            Engage in student clubs, events, arts, and culture — learning happens beyond the classroom.
          </p>
        </div>
      </div>

      <footer style={styles.footer} className="fade-in">
        © {new Date().getFullYear()} Limkokwing University Lesotho. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;
