import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      return;
    }

    axios.get('https://budgetbuddyapp.onrender.com/accountInfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setLoading(false);
      if (response.data) {
        setUserInfo(response.data);
      } else {
        setError('No user information found.');
      }
    })
    .catch(error => {
      console.error('Error fetching user information:', error);
      setError('Failed to fetch user information');
      setLoading(false);
    });
  }, []);

  return (
    <div className={Styles.Account}>
      <h1 className={Styles.AccHeading}>Manage Account</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {error && <p className={Styles.Error}>{error}</p>}
          {!error && (
            <div>
              <p><strong>First Name:</strong> {userInfo.UsrFnm}</p>
              <p><strong>Last Name:</strong> {userInfo.UsrLnm}</p>
              <p><strong>Email:</strong> {userInfo.UsrEm}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
