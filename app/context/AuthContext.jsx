"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Listen to Firebase auth state changes (persists across tabs/refreshes)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/Password Signup
  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set displayName on the Firebase profile
    await updateProfile(userCredential.user, { displayName });
    // Update local state immediately
    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName,
      photoURL: null,
    });
    return userCredential.user;
  };

  // Email/Password Login
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Google Sign-In (always show account picker)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account consent' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // Password Reset (sends email via Firebase)
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      signInWithGoogle,
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
