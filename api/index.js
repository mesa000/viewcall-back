const express = require("express");
require("dotenv").config();

const cors = require("cors");
const { createClient } = require("pexels");
const routes = require("./routes/routes.js");
const { connectDB } = require("./config/database");

const app = express();

/**
 * Middleware configuration
 * - Parses incoming requests with JSON payloads
 * - Parses URL-encoded data (e.g., form submissions).
 * - Enables Cross-Origin Resource Sharing (CORS) for API access.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CORS configuration.
 * If ORIGIN exists, it is parsed as a comma-separated list.
 */
const allowedOrigins = process.env.ORIGIN?.split(",").map(s => s.trim()).filter(Boolean);
app.use(
  allowedOrigins && allowedOrigins.length > 0
    ? cors({ origin: allowedOrigins })
    : cors()
);

/**
 * Initialize database connection.
 * Uses Mongoose under the hood.
 * If the connection fails, the process will exit.
 */
connectDB();

/**
 * Mount the API routes.
 * All application routes are grouped and accessible under `/`.
 */
app.use("/", routes);

/**
 * Health check endpoint.
 * Provides a simple way to verify that the server is running.
 */
app.get("/", (req, res) => res.send("Server is running"));

/**
 * Start the server only if this file is run directly
 * Only starts if this file is executed directly (not imported),
 * which prevents multiple server instances when running tests.
 */
if (require.main === module) {
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
