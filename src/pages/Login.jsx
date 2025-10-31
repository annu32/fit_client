import React, { useState } from 'react';

function Login({ setPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // <-- 1. Add state for errors

  // 2. Make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // 3. Add try...catch block for API call
    try {
      const response = await fetch('https://fit-server-3.onrender.com', {
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
      
      // 4. Save the token to localStorage for future API calls
      localStorage.setItem('token', data.token);
      
      // 5. !! THIS IS THE NEW LINE YOU NEED !!
      // Save the user object to localStorage so App.jsx can read it on reload
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 6. Set the user in the main App state (this is from your API)
      setUser(data.user); // data.user should be { id, name, email }
      
      // 7. Redirect to the home page (which will now show the dashboard)
      setPage('home');

    } catch (err) {
      // Handle fetch errors or API errors
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center bg-light">
      <h2 className="text-center mb-4 fw-bold">Login to Fit_Gy</h2>
      <form onSubmit={handleSubmit} className="px-3 w-100">
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

        {/* 7. Add this block to display errors */}
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
