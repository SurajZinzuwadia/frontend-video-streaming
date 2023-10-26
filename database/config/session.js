const session = require("express-session");

const sessionConfig = {
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400000, // Set the session expiry time to 1 day in milliseconds (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  },
};

module.exports = session(sessionConfig);
