import React, { useState, createContext } from "react";

export const NotContext = createContext();

export const NotContextProvider = ({ children }) => {
  const [updateNot, setUpdateNot] = useState(false);
  const [cart, setCart] = useState([]);
  return (
    <NotContext.Provider value={{ updateNot, setUpdateNot, cart, setCart }}>
      {children}
    </NotContext.Provider>
  );
};
