import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const SUPER_ADMIN_EMAIL = "oozbekautomotive@gamil.com";
const SUPER_ADMIN_PASS = "oozbek4040";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [localUsers, setLocalUsers] = useState([]);

  // Load users and session from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('oozbek_users') || '[]');
    setLocalUsers(storedUsers);

    const session = JSON.parse(localStorage.getItem('oozbek_session'));
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
      setIsSuperAdmin(session.isSuperAdmin);
    }
  }, []);

  const login = (email, password) => {
    // 1. Check Super Admin
    if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASS) {
      const session = { user: { email, role: 'Super Admin' }, isSuperAdmin: true };
      setUser(session.user);
      setIsAuthenticated(true);
      setIsSuperAdmin(true);
      localStorage.setItem('oozbek_session', JSON.stringify(session));
      return { success: true, isAdmin: true };
    }

    // 2. Check Local Users
    const foundUser = localUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const session = { user: foundUser, isSuperAdmin: false };
      setUser(foundUser);
      setIsAuthenticated(true);
      setIsSuperAdmin(false);
      localStorage.setItem('oozbek_session', JSON.stringify(session));
      return { success: true, isAdmin: false };
    }

    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    localStorage.removeItem('oozbek_session');
  };

  const addUser = (userData) => {
    const updatedUsers = [...localUsers, userData];
    setLocalUsers(updatedUsers);
    localStorage.setItem('oozbek_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (email) => {
    const updatedUsers = localUsers.filter(u => u.email !== email);
    setLocalUsers(updatedUsers);
    localStorage.setItem('oozbek_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isSuperAdmin, 
      user, 
      localUsers,
      login, 
      logout,
      addUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
