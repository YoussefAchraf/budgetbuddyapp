const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
const cors = require("cors");
// Import the database connection

// Import routes
const Routes = require("./routes/Routes");

const App = express();

// Middleware
App.use(bodyParser.json());
App.use(express.static(path.join(__dirname, "client", "build")));

App.use(cors({
  origin: 'https://budgetbuddyapp.onrender.com'
}));

// Middleware to parse JSON bodies
App.use(express.json());
// Define API routes or other server logic here...

// Serve the React app for any other routes
/*App.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});*/

// Routes
App.use(Routes);

module.exports = App;
