import React, { useState } from "react";
import LogIn from "../login/LogIn";
import SignIn from "../signin/SignIn";
import Styles from "./Splash.module.css";

const Splash = ({ onLoginSuccess }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [fade, setFade] = useState(false);

  const handleSignInClick = () => {
    setFade(true);
    setTimeout(() => {
      setShowSignIn(true);
      setFade(false);
    }, 500); // Match the duration with CSS transition duration
  };

  const handleBackClick = () => {
    setFade(true);
    setTimeout(() => {
      setShowSignIn(false);
      setFade(false);
    }, 500); // Match the duration with CSS transition duration
  };

  return (
    <div className={Styles.Splash}>
      <div
        className={Styles.SplashSect}
        style={{ height: showSignIn ? 'var(--IdentSectHeight)' : 'var(--SplashSectHeight)' }}
      >
        {showSignIn && (
          <div
            onClick={handleBackClick}
            className={`${Styles.BackBtn} ${showSignIn ? Styles.showBackBtn : ''}`}
          >
            &#11178; {/* HTML entity for left arrow */}
          </div>
        )}
        <img
          src="./BudgetBuddy-Logo-Pwa.png"
          alt="BudgetBuddy Pwa Logo"
          width="200px"
          height="200px"
        />
        <h1>BudgetBuddy</h1>
      </div>
      <div className={`${Styles.IdentSect} ${fade ? Styles.fadeOut : Styles.fadeIn}`}>
        {showSignIn ? (
          <SignIn />
        ) : (
          <>
            <LogIn onLoginSuccess={onLoginSuccess} />
            <button
              className={Styles.SiBtn}
              onClick={handleSignInClick}
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Splash;
