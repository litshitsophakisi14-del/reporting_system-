import React, { useEffect } from "react";

const FacultiesPage = () => {
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
      marginBottom: "40px",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    facultiesContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
    },
    facultyCard: {
      backgroundColor: "#111",
      padding: "25px",
      width: "280px",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(255,255,255,0.05)",
      transition: "transform 0.4s ease, box-shadow 0.4s ease, opacity 1s ease",
      color: "#f2f2f2",
      cursor: "pointer",
    },
    facultyTitle: {
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "10px",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    facultyDesc: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#f2f2f2",
    },
    footer: {
      marginTop: "60px",
      padding: "20px 0",
      borderTop: "1px solid #222",
      color: "#777",
      fontSize: "0.9rem",
    },
  };

  const faculties = [
    {
      name: "Faculty of Communication Media & Broadcasting",
      description: "Programs in journalism, broadcasting, and digital media.",
    },
    {
      name: "Faculty of Communication & Information Technology",
      description: "Courses in IT, software engineering, and multimedia.",
    },
    {
      name: "Faculty of Business Management & Globalization",
      description: "Studies in entrepreneurship, HR, and international business.",
    },
    {
      name: "Faculty of Creativity in Tourism & Hospitality",
      description: "Training in hotel and tourism management, and events.",
    },
    {
      name: "Faculty of Architecture & the Built Environment",
      description: "Courses in interior architecture and architectural studies.",
    },
    {
      name: "Faculty of Design & Innovation",
      description: "Programs in fashion, graphic design, and advertising.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Internal CSS for hover & animations */}
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
        .faculty-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 6px 25px rgba(255,255,255,0.1);
        }
      `}</style>

      <h1 style={styles.heading} className="fade-in">Our Faculties</h1>

      <div style={styles.facultiesContainer}>
        {faculties.map((f, index) => (
          <div
            key={index}
            style={styles.facultyCard}
            className="faculty-card fade-in"
          >
            <h2 style={styles.facultyTitle}>{f.name}</h2>
            <p style={styles.facultyDesc}>{f.description}</p>
          </div>
        ))}
      </div>

      <footer style={styles.footer} className="fade-in">
        © {new Date().getFullYear()} Limkokwing University Lesotho. All rights reserved.
      </footer>
    </div>
  );
};

export default FacultiesPage;
