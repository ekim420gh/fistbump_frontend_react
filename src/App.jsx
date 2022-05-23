import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/fistBumpPortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // const [loading, setLoading] = useState(false);

  const contractAddress = "0x87EC0CFFBB45e48ABC34De674015F6c79Cc25181";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const fistbump = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const fistbumpPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let count = await fistbumpPortalContract.getTotalFistBumps();
          console.log("Retrieved total fistbump count...", count.toNumber());

          const fistbumpTxn = await fistbumpPortalContract.fistBump();
          console.log("Mining...", fistbumpTxn.hash);
  
          await fistbumpTxn.wait();
          console.log("Mined -- ", fistbumpTxn.hash);
  
          count = await fistbumpPortalContract.getTotalFistBumps();
          console.log("Retrieved total fistbump count...", count.toNumber());
          
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // setLoading(true)
    // setTimeout(() => {
    //   setLoading(false)
    // }, )
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        ⚡ What's up!
        </div>

        <div className="bio">
          I am Elbert and this is my first dApp! Powered by <a href="https://buildspace.so/" className="buildspace" target="_blank" rel="noopener noreferrer">buildspace</a>. Connect your Ethereum wallet and give me a fist bump!
        </div>

        <button className="fistbumpButton" onClick={fistbump}>
          Fist Bump!!! 👊
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="fistbumpButton" onClick={connectWallet}>
            Connect Wallet 🦊
          </button>
        )}
      </div>
    </div>
  );
}

export default App