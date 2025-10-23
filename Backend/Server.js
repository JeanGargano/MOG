// Main server file for initializing the Express application

import express from "express";
import cors from "cors";
import connectDB from "./DataBase/db.js";
import routes from "./Routes/routes.js";

// Connect to MongoDB database before starting the server
connectDB();

const app = express();
const PORT = 5000;

// Middleware configuration
app.use(cors()); // Enable CORS to allow cross-origin requests
app.use(express.json()); // Parse incoming JSON request bodies

// Register main application routes
app.use("/", routes);

/**
 * Root Endpoint
 * Used as a quick check to confirm the server is running.
 */
app.get("/", (req, res) => {
    res.send({ message: "Express server running successfully!" });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
