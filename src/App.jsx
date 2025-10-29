import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Form & Detail Components (used as pages)
import AddActivityForm from './components/AddActivityForm';
import SetGoals from './components/SetGoals';
import ActivityDetail from './components/ActivityDetail'; // 1. Import new component

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  
  // 2. Add state to hold the ID of the activity we want to view
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // The empty array [] means this runs only on mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('home'); // Go back to public home page
  };

  // 3. Create a handler for when an activity is deleted
  //    (This is passed to ActivityDetail)
  const onActivityDeleted = (deletedId) => {
    console.log('Activity deleted:', deletedId);
    // In a real app with a central state, you'd filter the list here
    // For now, we just go back home
    setPage('home');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header setPage={setPage} user={user} handleLogout={handleLogout} />

      <main className="flex-grow-1 py-4">
        {/* 4. Pass setSelectedActivityId to Home */}
        {page === 'home' && (
          <Home 
            setPage={setPage} 
            user={user} 
            setSelectedActivityId={setSelectedActivityId} 
          />
        )}
        
        {page === 'login' && <Login setPage={setPage} setUser={setUser} />}
        {page === 'register' && <Register setPage={setPage} />}
        
        {page === 'addActivity' && (
          <div className="container">
            <button onClick={() => setPage('home')} className="btn btn-outline-secondary mb-3">
              &larr; Back to Dashboard
            </button>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <AddActivityForm />
              </div>
            </div>
          </div>
        )}

        {page === 'setGoals' && (
          <div className="container">
            <button onClick={() => setPage('home')} className="btn btn-outline-secondary mb-3">
              &larr; Back to Dashboard
            </button>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <SetGoals />
              </div>
            </div>
          </div>
        )}
        
        {/* 5. NEW PAGE: Activity Detail */}
        {page === 'activityDetail' && (
          <div className="container">
            <ActivityDetail 
              activityId={selectedActivityId} 
              setPage={setPage}
              onActivityDeleted={onActivityDeleted}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

