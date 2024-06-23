import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import Styles from "./Dashboard.module.css";
import Budget from "../../components/budget/Budget";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isPwaMode, setIsPwaMode] = useState(false);
  const [userInfo, setUserInfo] = useState({ UsrFnm: '', UsrLnm: '' });

  useEffect(() => {
    const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsPwaMode(standaloneMode);

    // Fetch user info from the backend
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://budgetbuddyapp.onrender.com/accountInfo', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleButtonClick = (page) => {
    setSelectedPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    window.location.reload(); // Reload the page
  };

  const renderPage = () => {
    if (isPwaMode) {
      if (selectedPage === 'dashboard') {
        return (
          <div className={Styles.DashboardContent}>
            <div className={Styles.UsrInfoPwa}>
              <h4>Welcome <br/> {userInfo.UsrFnm} {userInfo.UsrLnm}</h4>
              <div onClick={handleLogout} className={Styles.Logout}>
                <FaSignOutAlt />
              </div>
            </div>
          </div>
        );
      } else if (selectedPage === 'account') {
        const Account = React.lazy(() => import('../account/Account'));
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <Account />
          </Suspense>
        );
      }
    } else {
      return (
        <div className={Styles.Dashboard}>
          <div className={Styles.UsrInfo}>
            <h4>Welcome {userInfo.UsrFnm} {userInfo.UsrLnm}</h4>
          </div>
          <div>
            <div className={Styles.UsrLastUpExps}>
              {/* Other content here */}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={isPwaMode ? Styles.PwaDashboard : Styles.Dashboard}>
      {renderPage()}
      {isPwaMode && (
        <div className={Styles.Buttons}>
          <div
            className={selectedPage === 'dashboard' ? Styles.SelectedIcon : Styles.Icon}
            onClick={() => handleButtonClick('dashboard')}
          >
            <FaChartBar color={selectedPage === 'dashboard' ? '#006F62' : 'lightgray'} />
            <span className={Styles.IconText}>Dashboard</span>
          </div>
          <div
            className={selectedPage === 'account' ? Styles.SelectedIcon : Styles.Icon}
            onClick={() => handleButtonClick('account')}
          >
            <FaUser color={selectedPage === 'account' ? '#006F62' : 'lightgray'} />
            <span className={Styles.IconText}>Account</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
