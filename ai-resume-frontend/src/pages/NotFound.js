import React from "react";
import "../styles/NotFound.css"; // Import your custom 404 page styles

const NotFound = () => {
  return (
    <div className="not-found-layout">
      <div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">
          Oops! The page you are looking for does not exist.
        </p>
        <a href="/" className="not-found-btn">
          Go Back to Home
        </a>
      </div>
      <footer className="not-found-footer">
        <p>
          &copy; {new Date().getFullYear()} Your Company | All Rights Reserved
        </p>
        <a href="https://www.yourwebsite.com/privacy-policy">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default NotFound;
