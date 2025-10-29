import React, { useState } from 'react';

function Register({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // 1. Add state for error and success messages
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    // 3. Use setError instead of alert for better UI
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // 4. Add try...catch block for API call
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Only send the fields your API needs
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors (e.g., "User already exists")
        throw new Error(data.message || 'Registration failed.');
      }

      // --- SUCCESS ---
      setSuccessMessage('Registration successful! You can now log in.');
      // Clear the form
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      // We don't need setPage('login') here,
      // the user can see the success message and click the link.

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center bg-light">
      <h2 className="text-center mb-4">Join Fit_Gy Today!</h2>
      <form onSubmit={handleSubmit} className="w-100 px-3 px-md-5">
        <div className="mb-3">
          <label htmlFor="registerName" className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control form-control-lg"
            id="registerName"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerEmail" className="form-label">Email</label>
          <input
            type="email"
            className="form-control form-control-lg"
            id="registerEmail"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            id="registerPassword"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            id="confirmPassword"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* 5. Add blocks to display messages */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-success btn-lg">Register</button>
        </div>
        <p className="text-center">
          Already have an account?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => setPage('login')}
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;