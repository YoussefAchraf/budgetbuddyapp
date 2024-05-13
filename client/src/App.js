// App.js

import React, { useEffect, useState } from 'react';
import { Link, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/signin/SignIn';
import LogIn from './pages/login/LogIn';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Splash from './pages/spscreen/Splash';

function App() {
  const location = useLocation();
  const [isPWA, setIsPWA] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status

  useEffect(() => {
    // Check if the app is running as a PWA
    const checkIsPWA = async () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWA(true);
      }
    };

    checkIsPWA();

    // Check if user is logged in
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    // Function to check if JWT is valid
    const checkTokenValidity = async () => {
      try {
        const response = await fetch('http://localhost:5000/VerUsrToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setIsLoggedIn(true); // Set isLoggedIn to true if token is valid
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };

    if (token) {
      checkTokenValidity();
    }

  }, []);

  return (
    <div className="App">
      {isPWA ? (
        <section className="PwaDisp">
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Splash />} />          
          </Routes>
        </section>
      ) : (
        <div className="WebDisp">
          <header>
            <div className="Bb_Logo">
              <img
                src="./BudgetBuddy.png"
                width="80px"
                height="70px"
                alt="BudgetBuddy logo"
              />
            </div>
            <nav>
              <Link className={`link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
              <Link className={`link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">Log in</Link>
              <Link className={`link ${location.pathname === '/signin' ? 'active' : ''}`} to="/signin">Sign in</Link>
            </nav>
          </header>
          <section className="ReqPg">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/dashboard"
                element={
                  isLoggedIn ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/" replace/> 
                  )
                }
              />
            </Routes>
          </section>
          <footer>
            <h4>BudgetBuddy App</h4>
          </footer>
        </div>
      )}
    </div>
  );
}
export default App;
