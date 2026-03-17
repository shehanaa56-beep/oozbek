import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  updateEmail,
  updatePassword,
  verifyBeforeUpdateEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

const SUPER_ADMIN_EMAIL = "oozbekautomotive@gamil.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data (role) from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.email));
        const userData = userDoc.exists() ? userDoc.data() : { role: 'User' };
        
        const isSuper = firebaseUser.email === SUPER_ADMIN_EMAIL;
        
        setUser({ ...firebaseUser, ...userData });
        setIsAuthenticated(true);
        setIsSuperAdmin(isSuper);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const isSuper = userCredential.user.email === SUPER_ADMIN_EMAIL;
      return { success: true, isAdmin: isSuper };
    } catch (error) {
      console.error("Login Error:", error);
      let message = "An error occurred during login.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Invalid email or password";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const updateUserEmail = async (newEmail) => {
    if (!auth.currentUser) return { success: false, message: "No user logged in" };
    try {
      // Try the modern verification method first
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      return { success: true, message: "A verification email has been sent to the new address. Please verify it to complete the change." };
    } catch (error) {
      console.error("Update Email Error:", error);
      let message = "Failed to update email.";
      if (error.code === 'auth/requires-recent-login') {
        message = "This operation is sensitive and requires recent authentication. Please log out and log back in to try again.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email updates are not enabled in your Firebase Console. Please enable 'Verify before change' in Auth Settings.";
      }
      return { success: false, message };
    }
  };

  const updateUserPassword = async (newPassword) => {
    if (!auth.currentUser) return { success: false, message: "No user logged in" };
    try {
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (error) {
      console.error("Update Password Error:", error);
      let message = "Failed to update password.";
      if (error.code === 'auth/requires-recent-login') {
        message = "This operation is sensitive and requires recent authentication. Please log out and log back in to try again.";
      }
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isSuperAdmin, 
      user, 
      login, 
      logout,
      updateUserEmail,
      updateUserPassword,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
