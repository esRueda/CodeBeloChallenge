import React, { useState, useEffect } from 'react';

const WalletConnector = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check if MetaMask is installed and auto-connect if already authorized
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          setErrorMessage('Failed to check wallet connection');
        }
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Connection to MetaMask was rejected');
      }
    } else {
      setErrorMessage('MetaMask is not installed');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Connect MetaMask
      </button>
      {walletAddress && (
        <p style={{ marginTop: '1rem', color: 'green' }}>
          ✅ Connected Wallet: <strong>{walletAddress}</strong>
        </p>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletConnector;
