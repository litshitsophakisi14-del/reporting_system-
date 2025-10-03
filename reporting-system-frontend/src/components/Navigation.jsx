import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    // ✅ If no valid token or role, clear localStorage
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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Limkokwing University Of Creative Technology
        </Link>

        <div className="navbar-menu">
          {/* Static links visible to everyone */}
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/about" className="navbar-item">About</Link>
          <Link to="/faculties" className="navbar-item">Faculties</Link>
          <Link to="/contact" className="navbar-item">Contact</Link>
          <Link to="/admissions" className="navbar-item">Admissions</Link>
          <Link to="/news" className="navbar-item">News</Link>

          {/* Show login/register if not logged in */}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="navbar-item">Login</Link>
              <Link to="/register" className="navbar-button">Register</Link>
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
  );
};

export default Navigation;
