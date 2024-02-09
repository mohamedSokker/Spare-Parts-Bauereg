import React, { useState, createContext } from "react";

export const StocksContext = createContext();

export const StocksContextProvider = ({ children }) => {
  const [currentItem, setCurrentItem] = useState("Current");

  return (
    <StocksContext.Provider value={{ currentItem, setCurrentItem }}>
      {children}
    </StocksContext.Provider>
  );
};
