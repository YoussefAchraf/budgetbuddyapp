import React, { useState } from 'react';
import axios from 'axios';
import UsrInpt from "../../components/usrinpt/UsrInpt";
import Styles from "./LogIn.module.css";

const LogIn = () => {
  const [UsrEm, setEmail] = useState('');
  const [UsrPwd, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://budgetbuddyapp.onrender.com/login', { UsrEm, UsrPwd });
      console.log('Login successful:', response.data);
      
      // Store JWT token in local storage
      localStorage.setItem('token', response.data.token);
      
      // Handle successful login
    } catch (error) {
      console.error('Login error:', error.response);
      if (error.response && error.response.data) {
        // Map error messages to corresponding input fields
        const newErrors = {};
        if (error.response.data === 'Email and password are required') {
          newErrors.UsrEm = 'Email is required';
          newErrors.UsrPwd = 'Password is required';
        } else if (error.response.data === 'Incorrect password') {
          newErrors.UsrPwd = 'Incorrect password';
        }
        setErrors(newErrors);
      } else {
        // Handle other errors
        setErrors({ general: 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <section className={Styles.LogIn}>
      <h1 className={Styles.h1}>Log in</h1>
      <form onSubmit={handleLogin}>
        <UsrInpt 
          InptId="UsrEm"
          InptLb="Email"
          InptTp="text"
          value={UsrEm}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          error={errors && errors.UsrEm}
        />
        <UsrInpt 
          InptId="UsrPwd"
          InptLb="Password"
          InptTp="password"
          value={UsrPwd}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          error={errors && errors.UsrPwd}
        />
        <button type="submit">Log in</button>
      </form>
    </section>
  );
}

export default LogIn;
