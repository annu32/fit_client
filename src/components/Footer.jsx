import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-auto">
      <div className="container">
        <p className="mb-0">&copy; {new Date().getFullYear()} Fit_Gy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
