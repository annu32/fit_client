import React, { useState } from 'react';

// 🎯 Defining the constant for the live registration endpoint
const REGISTER_API_URL = 'https://fit-server-3.onrender.com/api/register'; 

function Register({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Optional: Add minimum password length check
    if (form.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    try {
      // 🎯 Using the constant API URL
      const response = await fetch(REGISTER_API_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center bg-light">
      <h2 className="text-center mb-4">Join Fit_Gy Today!</h2>
      <form onSubmit={handleSubmit} className="w-100 px-3 px-md-5" style={{maxWidth: '450px', margin: '0 auto'}}>
        
        {/* Error and Success Messages */}
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