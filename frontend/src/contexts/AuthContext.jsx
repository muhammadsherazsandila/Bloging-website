import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

import Cookie from "js-cookie";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [author, setAuthor] = useState(null);
  const [userState, setUserState] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        author,
        setAuthor,
        userState,
        setUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
