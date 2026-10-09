import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("userId")
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("userName")
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const isLoggedIn = !!token;

  const login = (
    token,
    userId,
    userRole,
    name,
    email
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    setToken(token);
    setCurrentUser(userId);
    setRole(userRole);
    setUserName(name);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setToken(null);
    setCurrentUser(null);
    setRole(null);
    setUserName(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userName,
        userEmail,
        token,
        role,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}