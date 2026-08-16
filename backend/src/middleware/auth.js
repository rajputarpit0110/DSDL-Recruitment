const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check HttpOnly cookie first, then fallback to Authorization header
  let token = req.cookies?.dsdl_admin_token;

  console.log(token)

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Admin authentication required.'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'dsdl_fallback_jwt_secret_key';
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.'
    });
  }
};

module.exports = authMiddleware;
