import React from 'react';
import GoalSummary from '../components/GoalSummary';
import ActivitySummary from '../components/ActivitySummary';
import ActivityChart from '../components/ActivityChart'; // 1. Import the new chart

// Accept setSelectedActivityId from App.jsx
function Home({ setPage, user, setSelectedActivityId }) {
  
  // --- IF USER IS NOT LOGGED IN ---
  if (!user) {
    return (
      <div>
        {/* Hero Section */}
        <section className="bg-primary text-white text-center py-5">
          <div className="container">
            <h1 className="display-3 fw-bold">Welcome to Fit_Gy</h1>
            <p className="lead mb-4">
              Your ultimate fitness companion — track workouts, monitor progress, and crush your goals.
            </p>
            <button
              className="btn btn-light btn-lg px-4"
              onClick={() => setPage('register')}
            >
              Get Started
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="container py-5">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-success fw-bold">🏋️ Track Workouts</h5>
                  <p className="card-text">Log exercises, sets, and weights to see your strength grow.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-info fw-bold">📈 Monitor Progress</h5>
                  <p className="card-text">Visualize your journey with charts and performance stats.</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow h-100">
                <div className="card-body text-center">
                  <h5 className="card-title text-warning fw-bold">🎯 Set Goals</h5>
                  <p className="card-text">Stay motivated by defining clear fitness milestones.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --- IF USER IS LOGGED IN ---
  return (
    <div className="container py-4">
      <h1 className="mb-4">Welcome back, {user.name}!</h1>
      
      {/* Dashboard Action Buttons */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="d-grid">
            <button onClick={() => setPage('addActivity')} className="btn btn-primary btn-lg p-4">
              <span className="h4">Add New Activity</span>
            </button>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="d-grid">
            <button onClick={() => setPage('setGoals')} className="btn btn-success btn-lg p-4">
              <span className="h4">Manage Your Goals</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. --- NEW: Activity Chart --- */}
      <div className="row mb-4">
        <div className="col-12">
          <ActivityChart />
        </div>
      </div>
      
      {/* Dashboard Summaries */}
      <div className="row g-4">
        <div className="col-lg-7">
          <ActivitySummary 
            setPage={setPage} 
            setSelectedActivityId={setSelectedActivityId} 
          />
        </div>
        <div className="col-lg-5">
          <GoalSummary />
        </div>
      </div>
    </div>
  );
}

export default Home;

