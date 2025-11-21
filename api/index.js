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
 * Official Pexels client initialized with the API key.
 */
const pexelsClient = createClient(process.env.PEXELS_API_KEY);

/**
 * Pexels API Routes
 */

/**
 * GET /api/videos/popular
 * Returns the Pexels JSON of popular videos.
 * Currently fixed at per_page: 3.
 *
 * Responses:
 * - 200 OK: JSON object as returned by Pexels.
 * - 500 : { error: "Failed to fetch popular videos" }
 */
app.get("/api/videos/popular", async (req, res) => {
  try {
    const data = await pexelsClient.videos.popular({ per_page: 6 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

/**
 * GET /api/videos/search
 * Search videos by query parameter.
 * 
 * Query params:
 * - query: Search term (required)
 * 
 * Responses:
 * - 200 OK: JSON object with search results
 * - 400 : { error: "Missing search query" }
 * - 500 : { error: "Failed to fetch videos" }
 */
app.get("/api/videos/search", async (req, res) => {
  const query = req.query.query;
  
  if (!query) {
    return res.status(400).json({
      error: "Missing search query"
    });
  }
  
  try {
    const data = await pexelsClient.videos.search({ query, per_page: 6 });
    res.json(data);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

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
