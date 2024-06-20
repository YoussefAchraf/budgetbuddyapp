const express = require('express');
const router = express.Router();
const {
  getUserInfo,
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

router.get('/accountInfo',verifyToken,getUserInfo);

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

router.post('/VerUsrToken', verifyToken, (req, res) => {
  // If the token is successfully verified by the middleware, you can perform additional actions here if needed
  res.status(200).send('Token is valid');
});




module.exports = router;