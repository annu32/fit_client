import React, { useState, useEffect } from 'react';

// 🎯 Defining the constant for the live API endpoint
const ACTIVITIES_API_URL = 'https://fit-server-3.onrender.com/api/activities';

// 1. Accept setPage and setSelectedActivityId from Home.jsx
function ActivitySummary({ setPage, setSelectedActivityId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Fetching from the live URL
        const response = await fetch(ACTIVITIES_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Get the 3 most recent activities
          setActivities(data.slice(0, 3)); 
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []); // Empty array ensures this runs once

  // 2. Click handler function
  const handleActivityClick = (id) => {
    setSelectedActivityId(id); // Set the ID in App.jsx
    setPage('activityDetail');  // Change the page
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Recent Activity</h2>
        {loading && <p>Loading activities...</p>}
        
        {!loading && activities.length === 0 && (
          <p>You haven't logged any activities yet. Click **"Add New Activity"** to start!</p>
        )}
        
        {!loading && activities.length > 0 && (
          // 3. Use list-group for clickable items
          <div className="list-group list-group-flush">
            {activities.map(activity => (
              <button
                key={activity._id}
                // 4. Make it a clickable button with hover effects
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center px-0"
                onClick={() => handleActivityClick(activity._id)}
              >
                <div>
                  <h5 className="mb-1">{activity.activityName}</h5>
                  <small className="text-muted">
                    {new Date(activity.date).toLocaleDateString()}
                  </small>
                </div>
                <span className="badge bg-primary rounded-pill">
                  {activity.caloriesBurned} kcal
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivitySummary;