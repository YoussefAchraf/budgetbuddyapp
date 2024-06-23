import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Styles from "./Account.module.css";

const Account = () => {
  const [userInfo, setUserInfo] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '' });
  const [editMode, setEditMode] = useState({ UsrFnm: false, UsrLnm: false, UsrEm: false });
  const [updatedMessage, setUpdatedMessage] = useState({ UsrFnm: '', UsrLnm: '', UsrEm: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: '' });
  const [showPassword, setShowPassword] = useState({ new: false });

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
      updateUserInfo(field, userInfo[field]);
    }
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const updateUserInfo = (field, value) => {
    const token = localStorage.getItem('token');
    let endpoint;

    switch (field) {
      case 'UsrFnm':
        endpoint = 'firstname';
        break;
      case 'UsrLnm':
        endpoint = 'lastname';
        break;
      case 'UsrEm':
        endpoint = 'email';
        break;
      default:
        return;
    }

    axios.put(`https://budgetbuddyapp.onrender.com/account/${endpoint}`, { [field]: value }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUpdatedMessage({ ...updatedMessage, [field]: `${field === 'UsrFnm' ? 'First Name' : field === 'UsrLnm' ? 'Last Name' : 'Email'} updated successfully` });
      if (field === 'UsrEm') {
        alert('Email updated successfully. Please log in again.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        setTimeout(() => {
          setUpdatedMessage({ ...updatedMessage, [field]: '' });
          setEditMode({ ...editMode, [field]: false });
        }, 1000);
      }
    })
    .catch(error => {
      console.error(`Error updating ${field}:`, error);
      setUpdatedMessage({ ...updatedMessage, [field]: `Failed to update ${field}` });
    });
  };

  const updatePassword = () => {
    const token = localStorage.getItem('token');
    axios.put(
      'https://budgetbuddyapp.onrender.com/account/password',
      { UsrPwd: passwords.newPassword }, // Sending the new password under the key 'UsrPwd'
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
    .then(response => {
      setUpdatedMessage({ ...updatedMessage, password: 'Password updated successfully' });
      setTimeout(() => {
        setUpdatedMessage({ ...updatedMessage, password: '' });
        setPasswords({ newPassword: '' });
      }, 1000);
    })
    .catch(error => {
      console.error('Error updating password:', error);
      setUpdatedMessage({ ...updatedMessage, password: 'Failed to update password' });
    });
  };

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword({ ...showPassword, new: !showPassword.new });
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm("Are you sure you want to delete your account?");
    if (confirmation) {
      const token = localStorage.getItem('token');
      axios.delete('https://budgetbuddyapp.onrender.com/account', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        alert('Account deleted successfully. Logging out.');
        localStorage.removeItem('token');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      });
    }
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
                    type={showPassword.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className={Styles.Input}
                  />
                  <span onClick={togglePasswordVisibility} className={Styles.PasswordToggle}>
                    {showPassword.new ? '🙈' : '👁️'}
                  </span>
                </div>
                <button className={Styles.UpdateButton} onClick={updatePassword}>Update Password</button>
              </div>
            )}
            <button className={Styles.DeleteAccountButton} onClick={handleDeleteAccount}>
              Delete Account
            </button>
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
