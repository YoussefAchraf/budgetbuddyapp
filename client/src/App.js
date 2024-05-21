import React, { useEffect, useState } from 'react';
import { Link, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/signin/SignIn';
import LogIn from './pages/login/LogIn';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Splash from './pages/spscreen/Splash';
import Account from './pages/account/Account'; 

function App() {
  const location = useLocation();
  const [isPWA, setIsPWA] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login status
  const [tokenChecked, setTokenChecked] = useState(false); // Track if token validity check is done

  useEffect(() => {
    const checkIsPWA = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWA(true);
      }
    };

    checkIsPWA();

    const token = localStorage.getItem('token');

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
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      } finally {
        setTokenChecked(true);
      }
    };

    if (token) {
      checkTokenValidity();
    } else {
      setTokenChecked(true); // No token to check, proceed to show public routes
    }

  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!tokenChecked) {
    return <div>Loading...</div>; // Show loading indicator while checking token
  }

  return (
    <div className="App">
      {isPWA ? (
        <section className="PwaDisp">
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/account" element={<Account />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Splash />} />
                <Route path="/login" element={<LogIn onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </section>
      ) : (
        <>
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
              {isLoggedIn ? (
                <>
                  <Link className={`link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
                  <Link className={`link ${location.pathname === '/account' ? 'active' : ''}`} to="/account">Account</Link>
                  <Link className="link" to="/" onClick={handleLogout}>Logout</Link>
                </>
              ) : (
                <>
                  <Link className={`link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
                  <Link className={`link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">Log in</Link>
                  <Link className={`link ${location.pathname === '/signin' ? 'active' : ''}`} to="/signin">Sign in</Link>
                </>
              )}
            </nav>
          </header>
          <section className="ReqPg">
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<LogIn onLoginSuccess={handleLoginSuccess} />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </section>
          <footer>
            <h4>BudgetBuddy App</h4>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
