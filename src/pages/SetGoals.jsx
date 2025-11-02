import React, { useState, useEffect } from 'react';

// 🎯 UPDATE: The single source of truth for your live API endpoint
const API_BASE_URL = 'https://fit-server-3.onrender.com/api/goals'; 

function SetGoals() {
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(3);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. --- Load existing goals when component mounts ---
  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to manage goals.');
        setLoading(false);
        return;
      }

      try {
        // Fetching from the new live URL
        const response = await fetch(API_BASE_URL, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          if (data) {
            setDailyCalories(Number(data.dailyCalories));
            setWeeklyWorkouts(Number(data.weeklyWorkouts));
          }
        } else {
          throw new Error(data.message || 'Failed to fetch goals');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []); 

  // 2. --- Handle submitting the form (with Validation) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Client-Side Validation Block 
    const calGoal = Number(dailyCalories);
    const workoutGoal = Number(weeklyWorkouts);

    if (isNaN(calGoal) || calGoal <= 0) {
      setError('Target Daily Calories must be a positive number.');
      return; 
    }

    if (isNaN(workoutGoal) || workoutGoal <= 0) {
      setError('Target Workouts Per Week must be a positive number.');
      return; 
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    try {
      // Posting to the new live URL
      const response = await fetch(API_BASE_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dailyCalories: calGoal, 
          weeklyWorkouts: workoutGoal
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save goals');
      }

      setMessage(data.message || 'Goals saved successfully!');

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading goals...</p>;
  }

  // 3. --- The Form ---
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <h2>Set Your Goals</h2>
      
      <label className="form-label">
        Target Daily Calories:
        <input
          type="number"
          className="form-control"
          value={dailyCalories}
          onChange={(e) => setDailyCalories(e.target.value)}
          required
          min="1"
        />
      </label>

      <label className="form-label">
        Target Workouts Per Week:
        <input
          type="number"
          className="form-control"
          value={weeklyWorkouts}
          onChange={(e) => setWeeklyWorkouts(e.target.value)}
          required
          min="1"
        />
      </label>
      
      <button type="submit" className="btn btn-success">Save Goals</button>
      
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SetGoals;