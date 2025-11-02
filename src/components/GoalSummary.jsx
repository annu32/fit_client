import React, { useState, useEffect } from 'react';

// 🎯 Defining the constant for the live API endpoint
const GOALS_API_URL = 'https://fit-server-3.onrender.com/api/goals';

function GoalSummary() {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Fetching from the live URL
        const response = await fetch(GOALS_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setGoal(data);
        }
      } catch (err) {
        console.error("Failed to fetch goals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Your Goals</h2>
        {loading && <p>Loading goals...</p>}
        
        {!loading && !goal && (
          <p>You haven't set any goals yet. Click **"Manage Goals"** to start!</p>
        )}
        
        {!loading && goal && (
          <div>
            <div className="mb-2">
              <span className="h5">{goal.dailyCalories.toLocaleString()}</span>
              <p className="text-muted mb-0">Target Daily Calories</p>
            </div>
            <div>
              <span className="h5">{goal.weeklyWorkouts}</span>
              <p className="text-muted mb-0">Target Workouts Per Week</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalSummary;