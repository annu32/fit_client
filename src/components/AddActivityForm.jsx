import React, { useState } from 'react';

/**
 * A form component for users to log a new fitness activity.
 * Includes client-side validation to ensure duration and calories are positive numbers.
 * * @param {object} props
 * @param {function} props.onActivityAdded - Callback function to notify the parent component 
 * when an activity is successfully added (e.g., to refresh a list).
 */
function AddActivityForm({ onActivityAdded }) {
  // State for form inputs
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  // Default date to today in 'YYYY-MM-DD' format
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  
  // State for feedback messages
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous feedback messages
    setError(null);
    setSuccessMessage(null);

    // --- 1. Client-Side Validation Logic ---
    const numDuration = Number(duration);
    const numCalories = Number(caloriesBurned);

    // Validate Activity Name
    if (!activityName.trim()) {
      setError('Activity Name is required.');
      return;
    }
    
    // Validate Duration: must be a positive number
    if (isNaN(numDuration) || numDuration <= 0) {
      setError('Duration must be a positive number (in minutes).');
      return;
    }

    // Validate Calories Burned: must be a positive number
    if (isNaN(numCalories) || numCalories <= 0) {
      setError('Calories Burned must be a positive number.');
      return;
    }
    // ---------------------------------------

    // Check for authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add an activity.');
      return;
    }

    // --- 2. API Submission ---
    try {
      const response = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          activityName,
          // Send the validated number values
          duration: numDuration, 
          caloriesBurned: numCalories,
          date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response from the server (e.g., backend validation error)
        throw new Error(data.message || 'Failed to add activity');
      }

      // --- 3. Handle Success ---
      setSuccessMessage('Activity added successfully!');
      
      // Clear the form fields
      setActivityName('');
      setDuration('');
      setCaloriesBurned('');
      
      // Notify parent component
      if (onActivityAdded) {
        onActivityAdded(data.activity); 
      }

    } catch (err) {
      // Catch network errors or specific errors thrown above
      setError(err.message);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        maxWidth: '400px', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <h3>🏋️ Log a New Activity</h3>
      
      {/* Activity Name Input */}
      <input
        type="text"
        placeholder="Activity Name (e.g., Running)"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        required
        aria-label="Activity Name"
      />
      
      {/* Duration Input */}
      <input
        type="number"
        placeholder="Duration (in minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
        min="1" // Client-side hint
        aria-label="Duration"
      />
      
      {/* Calories Burned Input */}
      <input
        type="number"
        placeholder="Calories Burned"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
        required
        min="1" // Client-side hint
        aria-label="Calories Burned"
      />
      
      {/* Date Input */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        aria-label="Date"
      />
      
      <button 
        type="submit" 
        style={{ 
          padding: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Activity
      </button>

      {/* Feedback Messages */}
      {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {successMessage}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {error}</p>}
    </form>
  );
}

export default AddActivityForm;