const express = require('express');
const router = express.Router();
const { 
  saveUserData, 
  loginUser, 
  deleteAccount, 
  deleteBudget, 
  deleteExpense, 
  updateBudget, 
  updateExpense, 
  updateUserEmail, 
  updateUserFirstName, 
  updateUserLastName, 
  updateUserPassword, 
  addBudget, 
  addExpense, 
  verifyToken, 
  deleteExpensesByBudgetId 
} = require('../controllers/Controllers');

// User registration endpoint
router.post('/register', saveUserData);

// User login endpoint
router.post('/login', loginUser);

// Middleware to verify JWT token for the following routes
router.use(verifyToken);

// Add budget endpoint
router.post('/addBudget', addBudget);

// Add expense endpoint
router.post('/addExpense', addExpense);

// Delete user account endpoint
router.delete('/account', deleteAccount);

// Delete budget endpoint
router.delete('/deleteBudget/:budgetId', deleteBudget);

// Delete expense endpoint
router.delete('/deleteExpense/:expenseId', deleteExpense);
router.delete('/deleteAllExpenses/:budgetId', deleteExpensesByBudgetId);

// Update user account endpoints
router.put('/account/email', updateUserEmail);
router.put('/account/firstname', updateUserFirstName);
router.put('/account/lastname', updateUserLastName);
router.put('/account/password', updateUserPassword);

// Update budget endpoint
router.put('/budget/:budgetId', updateBudget);

// Update expense endpoint
router.put('/updateExpense/:expenseId', updateExpense);

module.exports = router;
