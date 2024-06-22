import React, { useState, useEffect, Suspense } from 'react';
import Styles from "./Dashboard.module.css";
import { FaChartBar, FaUser } from 'react-icons/fa'; // Import icons
import Budget from "../../components/budget/Budget";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [isPwaMode, setIsPwaMode] = useState(false);

  useEffect(() => {
    const standaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsPwaMode(standaloneMode);
  }, []);

  const handleButtonClick = (page) => {
    setSelectedPage(page);
  };

  const renderPage = () => {
    if (isPwaMode) {
      if (selectedPage === 'dashboard') {
        return (
          <div className={Styles.DashboardContent}>
            <h1 className={Styles.DashHeading}>Dashboard page</h1>
            <h4>Dashboard is under construction and will be updated soon</h4>
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
          <div className={Styles.UsrMoney}>
            //user budget
            //Total Expenses component
            //rest money
          </div>
          <div>
            //UsrChar
            <div className={Styles.UsrLastUpExps}>
              //latest Updated expenses
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
