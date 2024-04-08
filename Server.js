require("dotenv").config();
require("./model/Db");
const app = require("./App"); // Import 'app' from 'App.js'

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
