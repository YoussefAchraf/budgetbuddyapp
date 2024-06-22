import React, { useState } from 'react';
import axios from 'axios';
import Styles from "./Budget.module.css";

const Budget = () => {
  const [budgetValue, setBudgetValue] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setBudgetValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Token is missing. Please log in again.');
        return;
      }

      const response = await axios.post('http://localhost:5000/addBudget', 
        { BudgVl: budgetValue }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setMessage(response.data.message); // Assuming response has a message property
    } catch (error) {
      setMessage(error.response?.data || 'An error occurred');
    }
  };

  return (
    <div className={Styles.Budget}>
      First start with adding up your budget
      <form onSubmit={handleSubmit}>
        <label>
          Budget Value:
          <input type="number" value={budgetValue} onChange={handleInputChange} />
        </label>
        <button type="submit">Add Budget</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Budget;
 