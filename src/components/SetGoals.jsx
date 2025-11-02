import React, { useState, useEffect } from 'react';

function SetGoals() {
  // Use state to manage input values
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(3);
  
  // State for feedback messages
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
        const response = await fetch('http://localhost:5000/api/goals', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();

        if (response.ok) {
          if (data) {
            // Set the state using existing goal data (ensuring it's treated as a number)
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

  // 2. --- Handle submitting the form with Validation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // --- 🎯 CLIENT-SIDE VALIDATION BLOCK ADDED ---
    const calGoal = Number(dailyCalories);
    const workoutGoal = Number(weeklyWorkouts);

    // 1. Validate Target Daily Calories
    if (isNaN(calGoal) || calGoal <= 0) {
      setError('Target Daily Calories must be a positive number.');
      return; // Stop submission
    }

    // 2. Validate Target Workouts Per Week
    if (isNaN(workoutGoal) || workoutGoal <= 0) {
      setError('Target Workouts Per Week must be a positive number (at least 1).');
      return; // Stop submission
    }
    // ------------------------------------------------

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
          // Use the validated number values
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
          min="1" // ⬅️ HTML Constraint for better user experience
          aria-label="Target Daily Calories"
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
          min="1" // ⬅️ HTML Constraint for better user experience
          aria-label="Target Workouts Per Week"
        />
      </label>
      
      <button type="submit" className="btn btn-success">Save Goals</button>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {error}</p>}
    </form>
  );
}

export default SetGoals;