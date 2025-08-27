const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try { const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET); req.user = payload; next(); } catch (err) { return res.status(401).json({ message: 'Invalid token' }); }
};
