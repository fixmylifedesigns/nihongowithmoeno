// src/context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store the user with only the necessary fields
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Failed to log out");
    }
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completion";
      case "auth/cancelled-popup-request":
        return "The sign-in popup was cancelled";
      case "auth/popup-blocked":
        return "Sign-in popup was blocked by the browser";
      case "auth/operation-not-allowed":
        return "This sign-in method is not enabled. Please contact support.";
      case "auth/network-request-failed":
        return "Network error occurred. Please check your connection.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
