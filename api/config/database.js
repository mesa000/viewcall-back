const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Establish a connection to the MongoDB database.
 *
 * Uses the connection string provided in the environment variable `MONGO_URI`.
 * On success, logs a confirmation message to the console.
 * On failure, logs the error message and immediately terminates the process
 * wiht exit code 1 to prevent the application form runnnig without a database. 
 * 
 * Notes:
 * - `useNewUrlParser` ensures the new MongoDB connection string parser is used.
 * - `useUnifiedTopology` opts in to the MongoDB driver's new connection management engine.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is established.
 * @throws Will terminate the process if the connection fails.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from the MongoDB database.
 *
 * Gracefully closes the active connection and logs the result to the console.
 * This helps free up resources and ensures the application can safely stop 
 * without leaving open database connections.
 * 
 * If an error occurs during disconnection, it is caught and logged, but the
 * process is not terminated since disconnection errors are not critical.
 *
 * @async
 * @function disconnectDB
 * @returns {Promise<void>} Resolves when the connection is closed.
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};

module.exports = { connectDB, disconnectDB };