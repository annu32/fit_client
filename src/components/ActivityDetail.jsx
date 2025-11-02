import React, { useState, useEffect } from 'react';

// 🎯 Defining the constant for the live API endpoint
const ACTIVITIES_API_BASE = 'https://fit-server-3.onrender.com/api/activities';

// 1. Accept activityId, setPage (to go back), and onActivityDeleted
function ActivityDetail({ activityId, setPage, onActivityDeleted }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the single activity's details when the component loads
  useEffect(() => {
    const fetchActivity = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in.');
        setLoading(false);
        return;
      }
      
      try {
        // Fetching a single activity from the live URL
        const response = await fetch(`${ACTIVITIES_API_BASE}/${activityId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Activity not found or unauthorized.');
        }
        
        const data = await response.json();
        setActivity(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]); // Re-run if the ID changes

  // 3. Handle deleting the activity
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      // Deleting the activity using the live URL
      const response = await fetch(`${ACTIVITIES_API_BASE}/${activityId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity.');
      }
      
      // Call the function passed from App.jsx to update the list
      if(onActivityDeleted) {
        onActivityDeleted(activityId);
      }
      // Go back to the dashboard
      setPage('home');
      
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading activity details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!activity) return <p>Activity not found.</p>;

  // 4. Display the full details
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title mb-4">{activity.activityName}</h2>
        
        <p className="h5"><strong>Duration:</strong> {activity.duration} minutes</p>
        <p className="h5"><strong>Calories Burned:</strong> {activity.caloriesBurned} kcal</p>
        <p className="h5"><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
        
        <hr />
        
        <button onClick={() => setPage('home')} className="btn btn-outline-secondary me-2">
          &larr; Back to Dashboard
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete Activity
        </button>
      </div>
    </div>
  );
}

export default ActivityDetail;