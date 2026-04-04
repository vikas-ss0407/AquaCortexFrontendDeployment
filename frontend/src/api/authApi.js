import axios from "axios";
import { login as firebaseLogin, logout as firebaseLogout, signup as firebaseSignup, subscribeToAuthChanges } from "../firebase/auth";

const BASE_URL = "http://localhost:5000/api/auth";

const registerUserInBackend = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Failed to register user in backend:", error);
    // Don't throw - allow Firebase auth to succeed even if backend fails
    return null;
  }
};

export const signup = async (payload) => {
  const user = await firebaseSignup(payload);
  
  // Register in backend Firestore
  if (user) {
    await registerUserInBackend({
      uid: user.id,
      email: user.email,
      fullName: user.fullName
    });
  }
  
  return user;
};

export const login = async (payload) => {
  return firebaseLogin(payload);
};

export const logout = async () => {
  return firebaseLogout();
};

export { subscribeToAuthChanges };
