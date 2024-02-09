import React, { useState, createContext } from "react";

export const LoginContext = createContext();

export const LoginContextProvider = ({ children }) => {
  const [usersData, setUsersData] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIcon, setCurrentIcon] = useState("Home");
  // const [currentPage, setCurrentPage] = useState({ name: "Home" });

  return (
    <LoginContext.Provider
      value={{
        usersData,
        setUsersData,
        token,
        setToken,
        currentIcon,
        setCurrentIcon,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
