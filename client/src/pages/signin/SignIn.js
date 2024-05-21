import React, { useState } from 'react';
import axios from 'axios';
import UsrInpt from "../../components/usrinpt/UsrInpt";
import Styles from "./SignIn.module.css";

const SignIn = () => {
  const [UsrFnm, setFirstName] = useState('');
  const [UsrLnm, setLastName] = useState('');
  const [UsrEm, setEmail] = useState('');
  const [UsrPwd, setPassword] = useState('');
  const [UsrRepPwd, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({}); // Reset errors
    setSuccessMessage(''); // Reset success message

    if (!UsrFnm || !UsrLnm || !UsrEm || !UsrPwd || !UsrRepPwd) {
      setErrors({
        UsrFnm: !UsrFnm ? 'First name is required' : '',
        UsrLnm: !UsrLnm ? 'Last name is required' : '',
        UsrEm: !UsrEm ? 'Email is required' : '',
        UsrPwd: !UsrPwd ? 'Password is required' : '',
        UsrRepPwd: !UsrRepPwd ? 'Repeat Password is required' : '',
      });
      
      return;
    }

    if (UsrPwd !== UsrRepPwd) {
      setErrors({ UsrRepPwd: 'Passwords do not match' });
      return;
    }

    try {
      const response = await axios.post('https://budgetbuddyapp.onrender.com/register', {
        UsrFnm,
        UsrLnm,
        UsrEm,
        UsrPwd,
      });

      console.log('User signed up successfully', response.data);
      setSuccessMessage('Account successfully created');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        const newErrors = { ...errors };

        if (responseData.includes('User already exists')) {
          newErrors.UsrEm = 'User already exists';
        }

        if (responseData.includes('Invalid email format')) {
          newErrors.UsrEm = 'Invalid email format';
        }

        setErrors(newErrors);
      }
    }
  };

  return (
    <section className={Styles.SignIn}>
      <h1 className={Styles.h1}>Sign in</h1>
      {successMessage && <p className={Styles.success}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <UsrInpt 
          InptId="UsrFnm"
          InptLb="First name"
          InptTp="text"
          value={UsrFnm}
          onChange={handleFirstNameChange}
          error={errors.UsrFnm}
        />
        <UsrInpt 
          InptId="UsrLnm"
          InptLb="Last name"
          InptTp="text"
          value={UsrLnm}
          onChange={handleLastNameChange}
          error={errors.UsrLnm}
        />
        <UsrInpt 
          InptId="UsrEm"
          InptLb="Email"
          InptTp="text"
          value={UsrEm}
          onChange={handleEmailChange}
          error={errors.UsrEm}
        />
        <UsrInpt 
          InptId="UsrPwd"
          InptLb="Password"
          InptTp="password"
          value={UsrPwd}
          onChange={handlePasswordChange}
          error={errors.UsrPwd}
        />
        <UsrInpt 
          InptId="UsrRepPwd"
          InptLb="Repeat Password"
          InptTp="password"
          value={UsrRepPwd}
          onChange={handleRepeatPasswordChange}
          error={errors.UsrRepPwd}
        />
        <button type="submit">Sign in</button>
      </form>
    </section>
  );
}

export default SignIn;
