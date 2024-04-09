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
        const response = await fetch('https://budgetbuddyapp.onrender.com/VerUsrToken', {
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
          <Splash />
          
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
              <Route path="https://budgetbuddyapp.onrender.com/" element={<Home />} />
              <Route path="https://budgetbuddyapp.onrender.com/login" element={<LogIn />} />
              <Route path="https://budgetbuddyapp.onrender.com/signin" element={<SignIn />} />
              <Route 
                path={isLoggedIn ? "https://budgetbuddyapp.onrender.com/dashboard" : "https://budgetbuddyapp.onrender.com/login"}
                element={isLoggedIn ? <Dashboard /> : <LogIn />}
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
