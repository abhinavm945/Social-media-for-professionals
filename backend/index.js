import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utlis/db.js";
import userRoute from "./routes/user.route.js";

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

//api
app.use("/api/v1/user", userRoute);

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
