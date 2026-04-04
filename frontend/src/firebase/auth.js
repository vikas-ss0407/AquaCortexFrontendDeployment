import app from "./firebaseConfig";
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

const auth = getAuth(app);
const persistenceReady = setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Failed to set Firebase auth session persistence:", error);
});

const mapFirebaseUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.uid,
    fullName: user.displayName || "Farmer",
    email: user.email || ""
  };
};

export const signup = async ({ fullName, email, password }) => {
  await persistenceReady;
  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (fullName?.trim()) {
    await updateProfile(credentials.user, {
      displayName: fullName.trim()
    });
  }

  return mapFirebaseUser(auth.currentUser);
};

export const login = async ({ email, password }) => {
  await persistenceReady;
  const credentials = await signInWithEmailAndPassword(auth, email, password);
  return mapFirebaseUser(credentials.user);
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
};

export const getCurrentUserToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export { auth };
