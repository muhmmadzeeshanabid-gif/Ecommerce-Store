"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if there's a logged-in user in session storage or local storage
    const savedSession = localStorage.getItem('zara_auth_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, displayName, securityAnswers = []) => {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('zara_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error("This email is already registered. Please login.");
    }

    const newUser = { 
      uid: Date.now().toString(),
      email, 
      password, 
      displayName,
      securityQuestions: securityAnswers // This will now be an array of {question, answer}
    };
    users.push(newUser);
    localStorage.setItem('zara_users', JSON.stringify(users));
    
    // Auto-login after signup
    setUser(newUser);
    localStorage.setItem('zara_auth_session', JSON.stringify(newUser));
    return newUser;
  };

  const login = async (email, password) => {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('zara_users') || '[]');
    const userExists = users.find(u => u.email === email);

    if (!userExists) {
      throw new Error("No account found with this email. Please sign up.");
    }

    if (userExists.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    setUser(userExists);
    localStorage.setItem('zara_auth_session', JSON.stringify(userExists));
    return userExists;
  };

  const resetPassword = async (email, newPassword, securityAnswers = []) => {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = JSON.parse(localStorage.getItem('zara_users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      throw new Error("No account found with this email.");
    }

    const savedUser = users[userIndex];
    
    // Verify security answers if they exist
    if (savedUser.securityQuestions && savedUser.securityQuestions.length > 0) {
      const match = savedUser.securityQuestions.every((qObj, idx) => 
        qObj.answer.toLowerCase().trim() === securityAnswers[idx]?.toLowerCase().trim()
      );
      if (!match) {
        throw new Error("Security answers are incorrect.");
      }
    }

    users[userIndex].password = newPassword;
    localStorage.setItem('zara_users', JSON.stringify(users));
    
    // If the user being reset is the currently logged-in user, update their session
    if (user && user.email === email) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      localStorage.setItem('zara_auth_session', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zara_auth_session');
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      resetPassword,
      logout, 
      showAuthModal, 
      openAuthModal, 
      closeAuthModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
