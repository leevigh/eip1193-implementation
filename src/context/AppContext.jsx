import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [connectedBalance, setConnectedBalance] = useState(null);
    const [error, setError] = useState(null);

    return (
      <AppContext.Provider value={{ 
        account, 
        setAccount, 
        chainId, 
        setChainId, 
        connectedBalance, 
        setConnectedBalance,
        error,
        setError 
      }}>
          {children}
      </AppContext.Provider>
    );
};
