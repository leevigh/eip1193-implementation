import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';

const useWalletConnect = () => {

    const {
      account,
      connectedBalance,
      setError,
      setConnectedBalance,
      setChainId,
      setAccount
    } = useContext(AppContext)
    // const [account, setAccount] = useState(null);
    // const [chainId, setChainId] = useState(null);
    // const [connectedBalance, setConnectedBalance] = useState(null);
    // const [error, setError] = useState(null);

    const ethereum = window.ethereum;

    const connectWallet = () => {
        if (ethereum) {
          ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(async (accounts) => {
                // console.log("ACCOUNTS:::", accounts)
                setAccount(accounts[0])
                getBalance(accounts[0])
              console.log(`Account::: ${accounts[0]}`);
            })
            .catch((error) => {
              setError(error.message)
              console.error(
                `Error fetching accounts: ${error.message}.
                Code: ${error.code}. Data: ${error.data}`
              );
            });
    
            ethereum
            .request({ method: 'eth_chainId' })
            .then((chainId) => {
              setChainId(chainId);
            //   console.log(`hexadecimal string: ${chainId}`);
            })
            .catch((error) => {
              console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
            });
        } else {
          setError('You have no wallet installed. Please install MetaMask.');
          return;
        }
    }

    const disconnectWallet = () => {
        setAccount(null);
        setChainId(null);
    }

    const getBalance = async (account) => {
        if (!ethereum) {
          console.log("No Ethereum provider found");
          return;
        }
    
        try {
          const balance = await ethereum.request({
            method: "eth_getBalance",
            params: [account, "latest"],
          });

          console.log("Balance:::", balance)
    
          const balanceInWei = ethers.toBigInt(balance);
          const balanceInEth = ethers.formatEther(balanceInWei)
          console.log("Balance in Wei", balanceInWei)
          console.log("Balance in ETH:::", balanceInEth);
        // console.log("Balance in ETH:", connectedBalance);
    
            setConnectedBalance(balanceInEth);
            return balanceInEth;
        } catch (error) {
          console.error("Error>>>",error);
        }
    };

    const handleBalanceReset = async () => {
        if(account) {
          const balance = await getBalance(account);
    
          setConnectedBalance(balance);
        }
    }

    useEffect(() => {
        if (ethereum) {
    
          const handleAccountsChanged = async (accounts) => {
            if(!accounts) {
              setAccount(null);
              return;
            }
            setAccount(accounts[0]);
            await getBalance(accounts[0]);
            // if (accounts.length > 0) {
            //   setAccount(accounts[0]);
            //   await getBalance(account[0]);
            // } else {
            //   setAccount(null);
            // }
          };
    
          const handleChainChanged = async (chainId) => {
            setChainId(chainId);
            await getBalance(account)
          };
    
          ethereum.on('accountsChanged', handleAccountsChanged);
          ethereum.on('chainChanged', handleChainChanged);
    
          return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
          };
        }
      }, [ethereum]);

    return { 
        connectWallet, 
        disconnectWallet,
        getBalance,
        handleBalanceReset
    }
}

export default useWalletConnect