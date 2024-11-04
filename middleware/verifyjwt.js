import jwt from 'jsonwebtoken';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the header

  if (!token) return res.status(403).send('Access denied, no token provided');

  try {
    const verified = jwt.verify(token, 'your_jwt_secret'); // Verify token
    req.user = verified; // Attach user info to the request
    next(); // Continue to the next middleware
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

export default authenticateToken ;
