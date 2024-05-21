import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/signin/SignIn';
import LogIn from './pages/login/LogIn';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Splash from './pages/spscreen/Splash';
import Account from './pages/account/Account';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPWA, setIsPWA] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);

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
      setTokenChecked(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && navOpen) {
        setNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navOpen]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/dashboard'); // Navigate to dashboard after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Navigate to home after logout
  };

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLinkClick = () => {
    setNavOpen(false);
  };

  if (!tokenChecked) {
    return <div>Loading...</div>;
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
                <Route path="/" element={<Splash onLoginSuccess={handleLoginSuccess} />} />
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
                src="./BudgetBuddy-Logo-Pwa.png"
                width="80px"
                height="70px"
                alt="BudgetBuddy logo"
              />
            </div>
            <button className="nav-toggle" onClick={toggleNav}>
              ☰
            </button>
            <nav ref={navRef} className={navOpen ? 'nav-open' : ''}>
              {isLoggedIn ? (
                <>
                  <Link className={`link ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
                  <Link className={`link ${location.pathname === '/account' ? 'active' : ''}`} to="/account" onClick={handleLinkClick}>Account</Link>
                  <Link className="link" to="/" onClick={() => { handleLogout(); handleLinkClick(); }}>Logout</Link>
                </>
              ) : (
                <>
                  <Link className={`link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={handleLinkClick}>Home</Link>
                  <Link className={`link ${location.pathname === '/login' ? 'active' : ''}`} to="/login" onClick={handleLinkClick}>Log in</Link>
                  <Link className={`link ${location.pathname === '/signin' ? 'active' : ''}`} to="/signin" onClick={handleLinkClick}>Sign in</Link>
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
