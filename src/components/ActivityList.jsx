import React, { useState, useEffect } from 'react';

// 🎯 Defining the constant for the live API endpoint
const ACTIVITIES_API_URL = 'https://fit-server-3.onrender.com/api/activities';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch activities when the component loads
  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to see your activities.');
        setLoading(false);
        return;
      }

      try {
        // Fetching from the live URL
        const response = await fetch(ACTIVITIES_API_URL, { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activities.');
        }

        const data = await response.json();
        setActivities(data); // Set the list of activities
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchActivities();
  }, []); 

  // 2. Handle deleting an activity
  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    const token = localStorage.getItem('token');
    setError(null); // Clear previous errors

    try {
      // Deleting using the live URL (with the activity ID appended)
      const response = await fetch(`${ACTIVITIES_API_URL}/${activityId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity.');
      }

      // 3. Remove the deleted activity from the local state
      setActivities(activities.filter(activity => activity._id !== activityId));

    } catch (err) {
      setError(err.message);
    }
  };

  // 4. Render the component UI
  if (loading) return <p>Loading activities...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (activities.length === 0) return <p>No activities found. Go add one!</p>;

  return (
    <div>
      <h2>Your Activities</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {activities.map(activity => (
          <li key={activity._id} className="card card-body mb-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title">{activity.activityName}</h5>
                <p className="card-text mb-1">Duration: **{activity.duration}** minutes</p>
                <p className="card-text mb-1">Calories: **{activity.caloriesBurned}** kcal</p>
                <small className="text-muted">Date: {new Date(activity.date).toLocaleDateString()}</small>
              </div>
              <button 
                onClick={() => handleDelete(activity._id)} 
                className="btn btn-sm btn-outline-danger"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityList;