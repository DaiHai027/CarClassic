"use client";

import { createContext, useState } from "react";


export const NavContext = createContext(null);

// Create a Context Provider
export const NavContextProvider = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [freshLoad, setFreshLoad] = useState(true);

  return (
    <NavContext.Provider value={{ showNav, setShowNav, freshLoad, setFreshLoad }}>
      {children}
    </NavContext.Provider>
  );
};
