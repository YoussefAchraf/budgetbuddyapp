import React, { useState } from "react";
import LogIn from "../login/LogIn";
import SignIn from "../signin/SignIn";
import Styles from "./Splash.module.css";

const Splash = () => {
  return(
    <div className={Styles.Splash}>
      <div className={Styles.SplashSect}>
        <img
          src="./BudgetBuddy-Logo-Pwa.png"
          alt="BudgetBuddy Pwa Logo"
          width="200px"
          height="200px"
        />
        <h1>BudgetBuddy</h1>
      </div>
      <div className={Styles.IdentSect}>
        <LogIn />
        <button>Sign in</button>
      </div>
    </div>
  );
};

export default Splash;
