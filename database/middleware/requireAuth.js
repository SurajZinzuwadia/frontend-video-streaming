// src/middlewares/requireAuth.js

const requireAuth = (req, res, next) => {
  console.log("Session user: ", req.session.user);
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

module.exports = requireAuth;
