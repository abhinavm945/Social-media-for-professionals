import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized", success: false });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ msg: "Invalid", success: false });
    }

    req.user = { id: decode.userId }; // ✅ Store the user info properly

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(500).json({ msg: "Server error", success: false });
  }
};

export default isAuthenticated;
