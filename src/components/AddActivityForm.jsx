import React, { useState } from 'react';

function AddActivityForm({ onActivityAdded }) {
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Defaults to today
  
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // 1. Get the token from storage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add an activity.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. Send the token in the Authorization header
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          activityName,
          duration: Number(duration),
          caloriesBurned: Number(caloriesBurned),
          date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add activity');
      }

      // 3. Handle success
      setSuccessMessage('Activity added successfully!');
      // Clear the form
      setActivityName('');
      setDuration('');
      setCaloriesBurned('');
      
      // Optional: Call a function from the parent to refresh the activity list
      if (onActivityAdded) {
        onActivityAdded(data.activity); 
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <h2>Add New Activity</h2>
      
      <input
        type="text"
        placeholder="Activity Name (e.g., Running)"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Duration (in minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Calories Burned"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      
      <button type="submit" className="btn btn-primary">Add Activity</button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default AddActivityForm;
