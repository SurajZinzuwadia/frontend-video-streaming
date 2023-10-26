import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('user')) || false);

  const login = () => {
    // Perform login logic
    setLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(true));
  };

  const logout = () => {
    // Perform logout logic
    setLoggedIn(false);
    localStorage.setItem('user', JSON.stringify(false));
  };
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Add prop validation for children
  };
  return <AuthContext.Provider value={{ loggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
