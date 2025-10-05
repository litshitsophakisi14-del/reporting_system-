import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUniversity, FaInfoCircle, FaEnvelope, FaNewspaper } from 'react-icons/fa';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token || !user.role) {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserRole('');
    } else {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  };

  return (
    <>
      <style>{`
        .navbar {
          background-color: #000;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 999;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          font-family: 'Poppins', sans-serif;
        }
        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1500px;
          padding: 0 30px;
        }
        .navbar-logo {
          color: #4ca1af;
          font-size: 1.6rem;
          font-weight: bold;
          text-decoration: none;
        }
        .navbar-menu {
          display: flex;
          align-items: center;
        }
        .navbar-item {
          color: #f2f2f2;
          text-decoration: none;
          padding: 8px 15px;
          margin: 0 5px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .navbar-item:hover {
          background: linear-gradient(90deg, #4ca1af, #c4e0e5);
          color: #000;
        }
        .navbar-button {
          padding: 8px 18px;
          background: linear-gradient(90deg, #4ca1af, #c4e0e5);
          color: #000;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          margin-left: 15px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .navbar-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76,161,175,0.6);
        }
        @media screen and (max-width: 960px) {
          .navbar-container {
            flex-direction: column;
            padding: 0 20px;
          }
          .navbar-menu {
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
          }
          .navbar-item, .navbar-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Limkokwing University
          </Link>

          <div className="navbar-menu">
            <Link to="/" className="navbar-item"><FaHome /> Home</Link>
            <Link to="/about" className="navbar-item"><FaInfoCircle /> About</Link>
            <Link to="/faculties" className="navbar-item"><FaUniversity /> Faculties</Link>
            <Link to="/contact" className="navbar-item"><FaEnvelope /> Contact</Link>
            <Link to="/news" className="navbar-item"><FaNewspaper /> News</Link>

            {!isLoggedIn ? (
              <>
                <Link to="/login" className="navbar-item">Login</Link>
                <Link to="/register" className="navbar-button">Signup</Link>
              </>
            ) : (
              <>
                {(userRole === 'lecturer' || userRole === 'prl' || userRole === 'pl') && (
                  <Link to="/reports" className="navbar-item">Reports</Link>
                )}
                {(userRole === 'prl' || userRole === 'pl') && (
                  <Link to="/courses" className="navbar-item">Courses</Link>
                )}
                <button onClick={handleLogout} className="navbar-button">Logout</button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
