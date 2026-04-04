import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD91W7yJd0Td3uPfMdyOk3ZdLwuqYnML80",
  authDomain: "wellwatersufficiencyprediction.firebaseapp.com",
  projectId: "wellwatersufficiencyprediction",
  storageBucket: "wellwatersufficiencyprediction.firebasestorage.app",
  messagingSenderId: "30030412773",
  appId: "1:30030412773:web:15918cc548358bd8b68d0c",
  measurementId: "G-3CVEW2DJCH"
};

const app = initializeApp(firebaseConfig);

export const initAnalytics = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const supported = await isSupported();
    return supported ? getAnalytics(app) : null;
  } catch {
    return null;
  }
};

export default app;
