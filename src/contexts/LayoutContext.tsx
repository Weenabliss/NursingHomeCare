import React, { createContext, useContext, useState } from "react";

interface LayoutContextType {
  footerContent: React.ReactNode | null;
  setFooterContent: (content: React.ReactNode | null) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  footerContent: null,
  setFooterContent: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [footerContent, setFooterContent] = useState<React.ReactNode | null>(null);

  return <LayoutContext.Provider value={{ footerContent, setFooterContent }}>{children}</LayoutContext.Provider>;
};
