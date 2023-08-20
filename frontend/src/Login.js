import React, { useState } from 'react';
import Web3 from 'web3';

function Login() {
  const [account, setAccount] = useState(null);

  const getWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      return web3;
    }
    return null;
  };

  const connectToMetaMask = async () => {
    const web3 = await getWeb3();
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      localStorage.setItem("address", accounts[0])
    } else {
      console.log("MetaMask not available");
      localStorage.setItem("address", null)
    }
  };

  return (
    <div>
      <button onClick={connectToMetaMask}>Connect MetaMask</button>
      {account && <p>Connected Account: {account}</p>}
    </div>
  );
}

export default Login;
