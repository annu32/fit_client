import React, { useState, useEffect } from 'react';
// We'll use the recharts library to build the chart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 🎯 Defining the constant for the live API endpoint
const ACTIVITIES_API_URL = 'https://fit-server-3.onrender.com/api/activities';

function ActivityChart() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllActivities = async () => {
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
          // Format the data for the chart
          // 1. Reverse the array so the oldest dates are first
          // 2. Format the date to be readable
          const formattedData = data.reverse().map(activity => ({
            ...activity,
            // Format date to "MM/DD" (e.g., "10/29")
            date: new Date(activity.date).toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit'
            })
          }));
          setActivities(formattedData);
        }
      } catch (err) {
        console.error("Failed to fetch all activities for chart", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllActivities();
  }, []); // Empty array ensures this runs once

  if (loading) return <p>Loading chart data...</p>;
  if (activities.length === 0) return <p>Log some activities to see your progress chart!</p>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="card-title h4 mb-4">Calories Burned Over Time</h2>
        {/* ResponsiveContainer makes the chart fit its parent div */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={activities}
            margin={{
              top: 5, right: 20, left: 10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="caloriesBurned" 
              stroke="#0d6efd" // A nice blue color
              strokeWidth={2}
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityChart;