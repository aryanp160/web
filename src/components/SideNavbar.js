import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, logOut } from "../firebase"; // Ensure firebase.js is properly set up
import "./SideNavbar.css"; // Ensure styles are loaded

const SideNavbar = () => {
  const [user, setUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // Track sidebar state

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`side-navbar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="navbar-container">
        {/* Logo area */}
        <div className="logo">
          {isExpanded ? (
            <i className="app-icon fas fa-book-open"></i> // Open book icon when expanded
          ) : (
            <i className="close-book-icon fas fa-book"></i> // Close book icon when collapsed
          )}
        </div>

        <ul className="navbar-list">
          <li>
            <Link to="/" className="navbar-link">
              <i className="fas fa-home"></i> <span className="nav-label">Home</span>
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/create-blog" className="navbar-link">
                <i className="fas fa-pencil-alt"></i> <span className="nav-label">Create Blog</span>
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/login" className="navbar-link">
                <i className="fas fa-sign-in-alt"></i> <span className="nav-label">Login</span>
              </Link>
            </li>
          )}
          {!user && (
            <li>
              <Link to="/signup" className="navbar-link">
                <i className="fas fa-user-plus"></i> <span className="nav-label">Sign Up</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Logout button */}
        {user && (
          <button onClick={logOut} className="navbar-link logout-btn">
            <i className="fas fa-sign-out-alt"></i> <span className="nav-label">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SideNavbar;
