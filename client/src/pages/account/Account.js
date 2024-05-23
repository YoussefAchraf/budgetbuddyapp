import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
  const [editMode, setEditMode] = useState({ UsrFnm: false, UsrLnm: false, UsrEm: false });
  const [updatedMessage, setUpdatedMessage] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState({ old: false, new: false });

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

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  return (
    <div className={Styles.Account}>
      <div className={Styles.Container}>
        <h1 className={Styles.AccHeading}>
          {isChangingPassword ? 'Change Password' : 'Personal Information'}
        </h1>
        {loading ? <p>Loading...</p> : (
          <>
            {error && <p className={Styles.Error}>{error}</p>}
            {!error && !isChangingPassword && (
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
            {isChangingPassword && (
              <div className={Styles.ChangePassword}>
                <div className={Styles.InputGroup}>
                  <input
                    type={showPassword.old ? 'text' : 'password'}
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Old Password"
                    className={Styles.Input}
                  />
                  <span onClick={() => togglePasswordVisibility('old')} className={Styles.PasswordToggle}>
                    {showPassword.old ? '🙈' : '👁️'}
                  </span>
                </div>
                <div className={Styles.InputGroup}>
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className={Styles.Input}
                  />
                  <span onClick={() => togglePasswordVisibility('new')} className={Styles.PasswordToggle}>
                    {showPassword.new ? '🙈' : '👁️'}
                  </span>
                </div>
                <button className={Styles.UpdateButton}>Update Password</button>
              </div>
            )}
          </>
        )}
        <button className={Styles.ChangePasswordButton} onClick={toggleChangePassword}>
          {isChangingPassword ? 'Personal Information' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default Account;
