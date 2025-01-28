import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utlis/db.js"; // Make sure this path is correct

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:5173", // Removed double quotes
  credentials: true, // Corrected "Credential" to "credentials"
};
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "I am coming from backend",
    success: true,
  });
});

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on ${PORT}`);
});
