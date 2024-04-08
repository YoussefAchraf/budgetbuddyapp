// LogIn.js
import React, { useState } from 'react';
import { useLoginMutation } from '../../api/UsersApi';
import UsrInpt from "../../components/usrinpt/UsrInpt";
import Styles from "./LogIn.module.css";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, isError }] = useLoginMutation();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password }).unwrap();
      console.log('Login successful:', data);
      // Handle successful login
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
    }
  };

  // Check if the app is running as a PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <section className={Styles.LogIn}>
      <h1 className={Styles.h1}>Log in</h1>
      <form onSubmit={handleLogin}>
        <UsrInpt 
          InptId="UsrEm"
          InptLb="Email"
          InptTp="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
        <UsrInpt 
          InptId="UsrPwd"
          InptLb="Password"
          InptTp="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
        <button type="submit">Log in</button>
      </form>
    </section>
  );
}

export default LogIn;
