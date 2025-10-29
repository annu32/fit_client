import React, { useState, useEffect } from 'react';

function SetGoals() {
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(3);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // To show loading state

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
        const response = await fetch('http://localhost:5000/api/goals', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          if (data) {
            // If user has goals, set them in the form
            setDailyCalories(data.dailyCalories);
            setWeeklyWorkouts(data.weeklyWorkouts);
          }
          // If data is null (no goals set), the form keeps its default values
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
  }, []); // Empty array [] ensures this runs only on mount

  // 2. --- Handle submitting the form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    try {
      // Call the POST /api/goals endpoint
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          dailyCalories: Number(dailyCalories), 
          weeklyWorkouts: Number(weeklyWorkouts) 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save goals');
      }

      setMessage(data.message); // "Goals saved successfully"

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
        />
      </label>
      
      <button type="submit" className="btn btn-success">Save Goals</button>
      
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SetGoals;
