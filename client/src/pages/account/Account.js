import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
  const [editMode, setEditMode] = useState({ UsrFnm: false, UsrLnm: false, UsrEm: false });
  const [updatedMessage, setUpdatedMessage] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
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

  const handleEditClick = (field) => {
    if (editMode[field]) {
      setUpdatedMessage({ ...updatedMessage, [field]: `${field === 'UsrFnm' ? 'First Name' : field === 'UsrLnm' ? 'Last Name' : 'Email'} updated successfully` });
    }
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className={Styles.Account}>
      <h1 className={Styles.AccHeading}>Manage Account</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {error && <p className={Styles.Error}>{error}</p>}
          {!error && (
            <div className={Styles.UserInfo}>
              <div className={Styles.InputGroup}>
                {editMode.UsrFnm ? (
                  <input
                    type="text"
                    name="UsrFnm"
                    value={userInfo.UsrFnm}
                    onChange={handleInputChange}
                    className={`${Styles.Input} ${editMode.UsrFnm ? Styles.Active : ''}`}
                  />
                ) : updatedMessage.UsrFnm ? (
                  <p className={Styles.UpdateMessage}>{updatedMessage.UsrFnm}</p>
                ) : (
                  <p className={Styles.StaticInfo}><strong>First Name:</strong> {userInfo.UsrFnm}</p>
                )}
                <button onClick={() => handleEditClick('UsrFnm')}>
                  {editMode.UsrFnm ? 'Update First Name' : 'Edit'}
                </button>
              </div>
              <div className={Styles.InputGroup}>
                {editMode.UsrLnm ? (
                  <input
                    type="text"
                    name="UsrLnm"
                    value={userInfo.UsrLnm}
                    onChange={handleInputChange}
                    className={`${Styles.Input} ${editMode.UsrLnm ? Styles.Active : ''}`}
                  />
                ) : updatedMessage.UsrLnm ? (
                  <p className={Styles.UpdateMessage}>{updatedMessage.UsrLnm}</p>
                ) : (
                  <p className={Styles.StaticInfo}><strong>Last Name:</strong> {userInfo.UsrLnm}</p>
                )}
                <button onClick={() => handleEditClick('UsrLnm')}>
                  {editMode.UsrLnm ? 'Update Last Name' : 'Edit'}
                </button>
              </div>
              <div className={Styles.InputGroup}>
                {editMode.UsrEm ? (
                  <input
                    type="email"
                    name="UsrEm"
                    value={userInfo.UsrEm}
                    onChange={handleInputChange}
                    className={`${Styles.Input} ${editMode.UsrEm ? Styles.Active : ''}`}
                  />
                ) : updatedMessage.UsrEm ? (
                  <p className={Styles.UpdateMessage}>{updatedMessage.UsrEm}</p>
                ) : (
                  <p className={Styles.StaticInfo}><strong>Email:</strong> {userInfo.UsrEm}</p>
                )}
                <button onClick={() => handleEditClick('UsrEm')}>
                  {editMode.UsrEm ? 'Update Email' : 'Edit'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
