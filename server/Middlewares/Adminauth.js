const isAdmin = (req, res, next) => {
  // For a simple hardcoded admin check:
  if (req.session && req.session.isAdmin) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized: Admin access required" });
};

module.exports = { isAdmin };