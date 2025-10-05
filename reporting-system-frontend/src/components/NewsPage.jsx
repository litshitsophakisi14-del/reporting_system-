import React, { useEffect } from "react";

const NewsPage = () => {
  // Scroll animation for fade/slide-in effect
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-slide");
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
      marginBottom: "50px",
      background: "linear-gradient(90deg, #4ca1af, #c4e0e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    newsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
    },
    newsCard: {
      backgroundColor: "#111",
      padding: "25px",
      borderRadius: "15px",
      width: "300px",
      boxShadow: "0 6px 25px rgba(255,255,255,0.05)",
      transition: "transform 0.4s ease, box-shadow 0.4s ease, opacity 1s ease",
      cursor: "pointer",
      textAlign: "left",
    },
    newsTitle: {
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#4ca1af",
    },
    newsDate: {
      fontSize: "0.9rem",
      color: "#aaa",
      marginBottom: "15px",
    },
    newsDesc: {
      fontSize: "1rem",
      lineHeight: "1.6",
      color: "#f2f2f2",
      marginBottom: "15px",
    },
    readMore: {
      color: "#4ca1af",
      fontWeight: "600",
      textDecoration: "none",
      fontSize: "0.9rem",
    },
    footer: {
      marginTop: "60px",
      padding: "20px 0",
      borderTop: "1px solid #222",
      color: "#777",
      fontSize: "0.9rem",
    },
  };

  // Example news items for Limkokwing University Lesotho
  const newsItems = [
    {
      title: "New Creative Lab Opens",
      date: "Oct 1, 2025",
      description: "Limkokwing University launches a state-of-the-art creative lab for students in Design & Innovation.",
      link: "#",
    },
    {
      title: "Guest Lecture: Digital Media Trends",
      date: "Oct 5, 2025",
      description: "Industry experts present the latest trends in digital media and creative technologies.",
      link: "#",
    },
    {
      title: "Annual Innovation Fair",
      date: "Nov 12, 2025",
      description: "Students showcase innovative projects and entrepreneurial ideas from all faculties.",
      link: "#",
    },
    {
      title: "Student Wins International Award",
      date: "Sep 20, 2025",
      description: "Our student receives global recognition for outstanding contributions in multimedia design.",
      link: "#",
    },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        .fade-slide {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-slide.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .news-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(255,255,255,0.1);
        }
        .read-more:hover {
          color: #c4e0e5;
          text-decoration: underline;
        }
      `}</style>

      <h1 style={styles.heading} className="fade-slide">University News & Events</h1>

      <div style={styles.newsContainer}>
        {newsItems.map((n, index) => (
          <div key={index} style={styles.newsCard} className="news-card fade-slide">
            <h2 style={styles.newsTitle}>{n.title}</h2>
            <p style={styles.newsDate}>{n.date}</p>
            <p style={styles.newsDesc}>{n.description}</p>
            <a href={n.link} style={styles.readMore} className="read-more">Read More →</a>
          </div>
        ))}
      </div>

      <footer style={styles.footer} className="fade-slide">
        © {new Date().getFullYear()} Limkokwing University Lesotho. All rights reserved.
      </footer>
    </div>
  );
};

export default NewsPage;
