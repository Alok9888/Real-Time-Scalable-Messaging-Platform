import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  try {
    // Check if the token cookie is present
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  } 
  
}