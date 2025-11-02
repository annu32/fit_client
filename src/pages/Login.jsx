import React, { useState } from 'react';

// 🎯 Defining the constant for the live login endpoint
const LOGIN_API_URL = 'https://fit-server-3.onrender.com/api/login'; 

function Login({ setPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Basic client-side validation (optional, but good practice)
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }

    try {
      // 🎯 Using the constant API URL
      const response = await fetch(LOGIN_API_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the API (like "User not found")
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      // --- SUCCESS ---
      
      // Save the token to localStorage for future authenticated API calls
      localStorage.setItem('token', data.token);
      
      // Save the user object for session persistence
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set the user in the main App state
      setUser(data.user); 
      
      // Redirect to the home page (dashboard)
      setPage('home');

    } catch (err) {
      // Handle fetch errors or API errors
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center bg-light">
      <h2 className="text-center mb-4 fw-bold">Login to Fit_Gy</h2>
      <form onSubmit={handleSubmit} className="px-3 w-100" style={{maxWidth: '450px', margin: '0 auto'}}>
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control form-control-lg w-100"
            id="loginEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg w-100"
            id="loginPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Display errors */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-primary btn-lg w-100">Login</button>
        </div>
        <p className="text-center">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setPage('register')}
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;