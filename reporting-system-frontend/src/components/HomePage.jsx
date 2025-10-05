import React, { useEffect } from "react";
import '../styles/HomePage.css';

const HomePage = () => {
  useEffect(() => {
    // Scroll animations
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

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Welcome to Limkokwing University Lesotho</h1>
        <p>
          A global university of innovation, creativity, and transformation — shaping future leaders for the world.
        </p>
      </header>

      <section className="home-intro fade-in">
        <p>
          At Limkokwing University Lesotho, we go beyond traditional education. 
          We empower students with creative skills, real-world experience, and 
          a global mindset. Our programs are designed to equip you for success 
          in today’s dynamic world.
        </p>
      </section>

      <section className="features">
        <div className="feature-card fade-in">
          <h2>🎓 Academic Excellence</h2>
          <p>
            Study under world-class faculty and experience innovative teaching 
            that blends creativity with practical industry exposure.
          </p>
        </div>

        <div className="feature-card fade-in">
          <h2>🌍 Global Network</h2>
          <p>
            Join a diverse international community that connects you to 
            opportunities across more than 30 countries.
          </p>
        </div>

        <div className="feature-card fade-in">
          <h2>💡 Creativity & Innovation</h2>
          <p>
            Discover your creative potential through hands-on projects, 
            technology-driven learning, and industry collaborations.
          </p>
        </div>

        <div className="feature-card fade-in">
          <h2>🎭 Student Life</h2>
          <p>
            Enjoy a vibrant campus culture filled with art, music, technology, 
            and community — where learning meets inspiration.
          </p>
        </div>
      </section>

      <footer className="home-footer fade-in">
        <p>
          © {new Date().getFullYear()} Limkokwing University Lesotho. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
