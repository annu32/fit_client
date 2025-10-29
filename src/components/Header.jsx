import React from 'react';

// 1. Accept 'user', 'setPage', and 'handleLogout' as props from App.jsx
function Header({ user, setPage, handleLogout }) {
  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        
        {/* Brand/Logo - clicking it goes home */}
        <a 
          className="navbar-brand fw-bold" 
          href="#home" 
          onClick={(e) => {
            e.preventDefault(); // Stop page reload
            setPage('home');  // Use setPage prop
          }}
        >
          Fit_Gy
        </a>

        {/* This div handles the right-aligned nav links */}
        <div className="navbar-nav ms-auto">
          {user ? (
            // 2. --- If user IS logged in ---
            <>
              <a 
                className="nav-link" 
                href="#home" 
                onClick={(e) => {
                  e.preventDefault();
                  setPage('home');
                }}
              >
                Home
              </a>
              <a 
                className="nav-link" 
                href="#logout" 
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout(); // Use handleLogout prop
                }}
              >
                Logout
              </a>
            </>
          ) : (
            // 3. --- If user IS NOT logged in ---
            <>
              <a 
                className="nav-link" 
                href="#login" 
                onClick={(e) => {
                  e.preventDefault();
                  setPage('login');
                }}
              >
                Login
              </a>
              <a 
                className="nav-link" 
                href="#register" 
                onClick={(e) => {
                  e.preventDefault();
                  setPage('register');
                }}
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
