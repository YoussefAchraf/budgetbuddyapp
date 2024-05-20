import React, { useState } from "react";
import LogIn from "../login/LogIn";
import SignIn from "../signin/SignIn";
import Styles from "./Splash.module.css";

const Splash = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const handleSignInClick = () => {
    setShowSignIn(true);
   
  };
  return (
    <div className={Styles.Splash}>
      <div 
        className={Styles.SplashSect} 
        style={{height:showSignIn}}>
        <img
          src="./BudgetBuddy.png"
          alt="BudgetBuddy Pwa Logo"
          width="200px"
          height="200px"
        />
        <h1>BudgetBuddy</h1>
      </div>
      <div className={Styles.IdentSect}>
        {showSignIn ? (
          <SignIn />
        ) : (
          <>
            <LogIn />
            <button 
              className={Styles.SiBtn}
              onClick={handleSignInClick}>
                Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Splash;
