//Controllers.js
const { json } = require("body-parser");
const Db = require("../model/Db");
const bcrypt = require('bcrypt');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Encryption key for UsrId, BudgId, and ExpId
const encryptionKey = process.env.ENCRYPTION_KEY || crypto.lib.WordArray.random(16).toString(crypto.enc.Hex); // Retrieve encryption key from environment or generate a new one

// Secret key for JWT token genera tion
const jwtSecretKey = process.env.JWT_KEY;

// Regular expressions for email, password, and name validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // At least 8 characters, one uppercase letter, one lowercase letter, and one number
const nameRegex = /^[a-zA-Z]+$/; // Only letters, no spaces

// Middleware to verify JWT token and extract user information
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('Token is required');
  }

  jwt.verify(token.split(' ')[1], jwtSecretKey, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).send('Failed to verify token');
    }

    req.user = decoded;
    next();
  });
};

// Function to save user data
exports.saveUserData = (req, res) => {
  const { UsrFnm, UsrLnm, UsrEm, UsrPwd } = req.body;

  // Check if fields are empty
  if (!UsrFnm || !UsrLnm || !UsrEm || !UsrPwd) {
    return res.status(400).send('All fields are required');
  }
  if (!emailRegex.test(UsrEm)) {
    return res.status(400).send('Invalid email format');
  }
  if (!passwordRegex.test(UsrPwd)) {
    return res.status(400).send('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  }
  if (!nameRegex.test(UsrFnm)) {
    return res.status(400).send('First name must contain only letters');
  }
  if (!nameRegex.test(UsrLnm)) {
    return res.status(400).send('Last name must contain only letters');
  }
  Db.query('SELECT * FROM user WHERE UsrEm = ?', [UsrEm], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to check user existence');
    }

    if (results.length > 0) {
      // User already exists
      return res.status(400).send('User already exists');
    }

    // User doesn't exist, proceed with insertion
    bcrypt.hash(UsrPwd, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Failed to hash password');
      }

      // Generate a unique UUID for UsrId
      const userId = uuidv4();

      // Encrypt UsrId using CryptoJS
      const encryptedUserId = crypto.AES.encrypt(userId, encryptionKey).toString();

      // Insert user data into 'user' table
      Db.query('INSERT INTO user (UsrId, UsrEm, UsrPwd, UsrFnm, UsrLnm) VALUES (?, ?, ?, ?, ?)', [encryptedUserId, UsrEm, hashedPassword, UsrFnm, UsrLnm], (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Failed to save user data');
        }
      });
    });
  });
};

// Function to login user and generate JWT token
exports.loginUser = (req, res) => {
  const { UsrEm, UsrPwd } = req.body;

  // Check if email and password are provided 
  if (!UsrEm || !UsrPwd) {
    return res.status(400).send('Email and password are required');
  }

  // Check if the user exists in the database
  Db.query('SELECT * FROM user WHERE UsrEm = ?', [UsrEm], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve user data');
    }

    if (results.length === 0) {
      // User does not exist
      return res.status(404).send('User not found');
    }

    const user = results[0];
    
    // Check if the provided password matches the hashed password in the database
    bcrypt.compare(UsrPwd, user.UsrPwd, (err, passwordMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Failed to verify password');
      }

      if (!passwordMatch) {
        // Passwords do not match
        return res.status(401).send('Incorrect password');
      }

      // Passwords match, generate JWT token with user's email
      const token = jwt.sign({ userEmail: user.UsrEm }, jwtSecretKey, { expiresIn: '1h' }); // Token expires in 1 hour

      // Send the JWT token as response
      res.status(200).json({ token });
    });
  });
};

// Function to add budget
exports.addBudget = (req, res) => {
  const { BudgVl } = req.body;
  const userEmail = req.user.userEmail; // Extracted from JWT token

  // Check if BudgVl field is provided
  if (!BudgVl) {
    return res.status(400).send('Budget value is required');
  }

  // Query userauth table to get UsrId based on userEmail
  Db.query('SELECT UsrId FROM user WHERE UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve user data');
    }

    if (results.length === 0) {
      // User does not exist or unauthorized
      return res.status(404).send('User not found or unauthorized');
    }

    // User exists, proceed with inserting budget
    const user = results[0];
    const userId = user.UsrId;
  
    // Insert budget data into 'budget' table with the original BudgId
    Db.query('INSERT INTO budget (BudgId, UsrId, BudgVl) VALUES (?, ?, ?)', [uuidv4(), userId, BudgVl], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to add budget');
      }

      res.status(200).send('Budget added successfully');
    });
  });
};

// Function to add expense
exports.addExpense = (req, res) => {
  const { ExpVl, BudgId } = req.body;
  const userEmail = req.user.userEmail; // Extracted from JWT token

  // Check if BudgId field is provided
  if (!BudgId) {
    return res.status(400).send('Budget ID is required');
  }

  // Query userauth table to get UsrId based on userEmail
  Db.query('SELECT UsrId FROM userauth WHERE UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve user data');
    }

    if (results.length === 0) {
      // User does not exist or unauthorized
      return res.status(404).send('User not found or unauthorized');
    }

    // User exists, proceed with checking if the budget exists
    const user = results[0];
    const userId = user.UsrId;

    // Check if the provided budget ID belongs to the user
    Db.query('SELECT * FROM budget WHERE BudgId = ? AND UsrId = ?', [BudgId, userId], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to retrieve budget data');
      }

      if (results.length === 0) {
        // Budget does not exist or unauthorized
        return res.status(404).send('Budget not found or unauthorized');
      } 

      // Budget exists, proceed with inserting expense
      const budget = results[0];

      // Insert expense data into 'expense' table with UsrId and BudgId
      Db.query('INSERT INTO expense (ExpId, BudgId, ExpVl) VALUES (?, ?, ?)', [uuidv4(), BudgId, ExpVl], (error, results, fields) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Failed to add expense');
        }

        res.status(200).send('Expense added successfully');
      });
    });
  });
};

// Function to delete user account
exports.deleteAccount = (req, res) => {
  const userEmail = req.user.userEmail;

  // Delete user from 'user' table
  Db.query('DELETE FROM user WHERE UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to delete user account');
    }

    // Since you have ON DELETE CASCADE configured, related records in 'userauth', 'budget', and 'expense' tables will be automatically deleted
    res.status(200).send('User account deleted successfully');
  });
};

// Function to delete budget
exports.deleteBudget = (req, res) => {
  const { budgetId } = req.params;
  const userEmail = req.user.userEmail; // Extracted from JWT token

  // Query userauth table to get UsrId based on userEmail
  Db.query('SELECT UsrId FROM user WHERE UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve user data');
    }

    if (results.length === 0) {
      // User does not exist or unauthorized
      return res.status(404).send('User not found or unauthorized');
    }

    // User exists, proceed with deleting budget
    const user = results[0];
    const userId = user.UsrId;

    // Delete budget from 'budget' table
    Db.query('DELETE FROM budget WHERE BudgId = ? AND UsrId = ?', [budgetId, userId], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to delete budget');
      }

      res.status(200).send('Budget deleted successfully');
    });
  });
};


// Function to delete expense
exports.deleteExpense = (req, res) => {
  const { expenseId } = req.params;
  const userEmail = req.user.userEmail; // Extracted from JWT token

  // Delete expense from 'expense' table based on ExpId
  Db.query('DELETE FROM expense WHERE ExpId = ?', [expenseId], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to delete expense');
    }

    res.status(200).send('Expense deleted successfully');
  });
};

// Function to delete all expenses based on budget ID
exports.deleteExpensesByBudgetId = (req, res) => {
  const { budgetId } = req.params;

  // Check if any expenses exist for the given budget ID
  Db.query('SELECT * FROM expense WHERE BudgId = ?', [budgetId], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve expenses');
    }

    // If no expenses found, return response indicating so
    if (results.length === 0) {
      return res.status(404).send('No expenses found to delete');
    }

    // Delete expenses from 'expense' table based on BudgId
    Db.query('DELETE FROM expense WHERE BudgId = ?', [budgetId], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to delete expenses');
      }

      res.status(200).send('Expenses deleted successfully');
    });
  });
};

// Function to update user email
exports.updateUserEmail = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { UsrEm } = req.body;

  // Check if email field is provided
  if (!UsrEm) {
    return res.status(400).send('Email is required');
  }
  if (!emailRegex.test(UsrEm)) {
    return res.status(400).send('Invalid email format');
  }

  // Update user email in 'userauth' table
  Db.query('UPDATE user SET UsrEm = ? WHERE UsrEm = ?', [UsrEm, userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to update user email');
    }

    res.status(200).send('User email updated successfully');
  });
};

// Function to update user first name
exports.updateUserFirstName = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { UsrFnm } = req.body;

  // Check if first name field is provided
  if (!UsrFnm) {
    return res.status(400).send('First name is required');
  }
  if (!nameRegex.test(UsrFnm)) {
    return res.status(400).send('First name must contain only letters');
  }

  // Update user first name in 'user' table
  Db.query('UPDATE user SET UsrFnm = ? WHERE UsrEm = ?', [UsrFnm, userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to update user first name');
    }

    res.status(200).send('User first name updated successfully');
  });
};

// Function to update user last name
exports.updateUserLastName = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { UsrLnm } = req.body;

  // Check if last name field is provided
  if (!UsrLnm) {
    return res.status(400).send('Last name is required');
  }
  if (!nameRegex.test(UsrLnm)) {
    return res.status(400).send('Last name must contain only letters');
  }

  // Update user last name in 'user' table
  Db.query('UPDATE user SET UsrLnm = ? WHERE UsrEm = ?', [UsrLnm, userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to update user last name');
    }

    res.status(200).send('User last name updated successfully');
  });
};

// Function to update user password
exports.updateUserPassword = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { UsrPwd } = req.body;

  // Check if password field is provided
  if (!UsrPwd) {
    return res.status(400).send('Password is required');
  }
  if (!passwordRegex.test(UsrPwd)) {
    return res.status(400).send('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
  }

  // Hash the new password
  bcrypt.hash(UsrPwd, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Failed to hash password');
    }

    // Update user password in 'userauth' table
    Db.query('UPDATE user SET UsrPwd = ? where UsrEm = ?', [hashedPassword, userEmail], (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Failed to update user password');
      }

      res.status(200).send('User password updated successfully');
    });
  });
};

// Function to update budget
exports.updateBudget = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { budgetId } = req.params;
  const { BudgVl } = req.body;

  // Update budget data in 'budget' table
  Db.query('UPDATE budget SET BudgVl = ? WHERE BudgId = ? AND UsrId = (select UsrId from userauth where UsrEm = ?)', [BudgVl, budgetId, userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to update budget');
    }

    res.status(200).send('Budget updated successfully');
  });
};

// Function to update expense
exports.updateExpense = (req, res) => {
  const userEmail = req.user.userEmail; // Extracted from JWT token
  const { expenseId } = req.params;
  const { ExpVl } = req.body;

  // Update expense data in 'expense' table
  Db.query('UPDATE expense SET ExpVl = ? WHERE ExpId = ?', [ExpVl, expenseId], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to update expense');
    }

    res.status(200).send('Expense updated successfully');
  });
};

// Function to get user information
exports.getUserInfo = (req, res) => {
  const UsrEm = req.user.userEmail;
  // Query user and userauth tables to get user information
  Db.query('SELECT UsrEm, UsrFnm, UsrLnm from user wher UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve user information');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Return the user information
    const userInfo = results[0];
    res.status(200).json(userInfo);
  });
};
exports.getUserInfo = (req, res) => {
  const userEmail = req.user.userEmail;

  // Query user and userauth tables to get user information
  Db.query('SELECT UsrEm, UsrFnm, UsrLnm FROM user WHERE UsrEm = ?', [userEmail], (error, results, fields) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).send('Failed to retrieve user information');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    // Return the user information
    const userInfo = results[0];
    res.status(200).json(userInfo);
  });
};
