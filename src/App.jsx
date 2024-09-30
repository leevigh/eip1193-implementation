import { useContext, useState } from 'react'
import './App.css'
import useWalletConnect from './hooks/useWalletConnect';
import { AppContext } from './context/AppContext';

function App() {
  const [address, setAddress] = useState("");
  const [otherBalance, setOtherBalance] = useState(null);
  
  const { 
    account, 
    connectedBalance, 
    chainId, 
    error } = useContext(AppContext);
    
  const { 
    connectWallet, 
    disconnectWallet, 
    getBalance,
    handleBalanceReset } = useWalletConnect();



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address) {
      const balance = await getBalance(address);
      
      setOtherBalance(balance)
    }
  };

  return (
    <>
      <div>
      {!account ? (
        <button onClick={connectWallet} style={{ 
          padding: '1rem', 
          border: '1px solid gray', 
          borderRadius: '1rem',
          cursor: 'pointer',
        }}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Account: <span style={{ color: 'greenyellow' }}>{account}</span></p>
          <p>Chain ID: {chainId}</p>
          <p>Balance: {connectedBalance}</p>
          <button
            onClick={() => {
              setOtherBalance(null)
              setAddress('')
              handleBalanceReset()
            }}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
          >
            Reset My Balance
          </button>

          <div className="py-4">
            <form onSubmit={handleSubmit} style={{ padding: '1rem'}} >
              <input
                type="text"
                placeholder="Enter Address"
                style={{ padding: '0.5rem' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 border border-white bg-black text-white rounded-md mr-4"
              />
              {/* <div>{otherBalance}</div> */}
              <button
                type="submit"
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200"
              >
                Get Balance
              </button>
            </form>
          </div>

          <div>
            <button onClick={disconnectWallet} style={{ 
              padding: '1rem', 
              border: '1px solid red', 
              borderRadius: '1rem',
              backgroundColor: 'red',
              cursor: 'pointer',
            }}>Disconnect Wallet</button>
          </div>
        </div>
      )}

      <div>{error}</div>
      </div>
    </>
  )
}

export default App
