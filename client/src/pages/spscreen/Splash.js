import React, { useState } from "react";
import { Link } from "react-router-dom";
import LogIn from "../login/LogIn";
import SignIn from "../signin/SignIn";
import Styles from "./Splash.module.css";

const Splash = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  
  const handleSignInClick = () => {
    setShowSignIn(true);
    document.documentElement.style.setProperty('--AlHeight', '40dvh');
    document.documentElement.style.setProperty('--AuTop', '40dvh');
  };

  const handleBackButtonClick = () => {
    setShowSignIn(false);
    document.documentElement.style.setProperty('--AlHeight', '60dvh');
    document.documentElement.style.setProperty('--AuTop', '60dvh');
  };

  return (
    <div className={Styles.Splash}>
      <div className={Styles.Logo}>
      {showSignIn ? 
        <div style={{width:'100dvw'}}>
        <button
          style={{border:'none', background:'none', color:'white',paddingLeft:'2dvh'}}
          onClick={handleBackButtonClick}>
          <span className="material-symbols-outlined" style={{fontSize:'40px'}}>undo</span>
        </button>
        </div>
      : null}
        <img
          src="./BudgetBuddy-Logo-Pwa.png"
          alt="BudgetBuddy Pwa Logo"
          width="200px"
          height="200px"
        />
        <h1>BudgetBuddy</h1>
      </div>
      <div className={Styles.UsrLog}>
        {showSignIn ? (
          <>
            <SignIn />
          </>
        ) : (
          <>
            <LogIn />
            <div style={{marginTop: '30px', textAlign:'center'}}>
              <Link 
                to="#" 
                onClick={handleSignInClick}
                style={{color: 'grey', textDecoration: 'none'}}
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Splash;
