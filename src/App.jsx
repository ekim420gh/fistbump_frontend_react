import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/fistBumpPortal.json";
import Fistbump from'./images/fistbump.jpg';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [all_fistbumps, setAllFistBumps] = useState([]);
  // const [loading, setLoading] = useState(false);

  const contractAddress = "0xa67ECA0520275Dbd00057235c491E8D4C045697F";
  const contractABI = abi.abi;

  // first, check if wallet is connected
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
        getAllFistBumps();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Create a method that gets all fists from your contract
   */
  const getAllFistBumps = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const fistbump_contract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the get_total_fistbumps method from your Smart Contract
         */
        const allFistBumps = await fistbump_contract.get_all_fistbumps();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let fistbumpsCleaned = [];
        allFistBumps.forEach(fistbump => {
          fistbumpsCleaned.push({
            address: fistbump.fistbumper,
            timestamp: new Date(fistbump.timestamp * 1000),
            message: fistbump.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllFistBumps(fistbumpsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
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
          const fistbump_contract = new ethers.Contract(contractAddress, contractABI, signer);
  
          let count = await fistbump_contract.get_total_fistbumps();
          console.log("Retrieved total fistbump count...", count.toNumber());

          const fistbumpTxn = await fistbump_contract.fistbump("Test message 1. YOOO");
          console.log("Mining...", fistbumpTxn.hash);
  
          await fistbumpTxn.wait();
          console.log("Mined -- ", fistbumpTxn.hash);
  
          count = await fistbump_contract.get_total_fistbumps();
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
        Mission: Fist Bump
        </div>

        <div className="powered_by">
          Thanks to <a href="https://buildspace.so/" className="buildspace" target="_blank" rel="noopener noreferrer">buildspace</a> 🙏
        </div>

        <div className="tagline">
           <ol>
            <li>Connect to <span className="accent">Ethereum mainnet</span></li>
            <li>Write down an <span className="accent">accomplishment</span></li>
            <li>Send a <span className="accent">fist bump</span> 🤜 🤛</li>
           </ol>
           <div class="note">... now ...</div>
        </div>
        
        <img src={Fistbump} alt="Mass Effect"/>

        <button className="fistbumpButton" onClick={fistbump}>
          BOOM 🤜🤛
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="fistbumpButton" onClick={connectWallet}>
            Connect Wallet 🦊
          </button>
        )}

        <div className="history">
          History 👊
        </div>
        
        {all_fistbumps.map((fist, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {fist.address}</div>
              <div>Time: {fist.timestamp.toString()}</div>
              <div>Message: {fist.message}</div>
            </div>)
        })}
        
      </div>
    </div>
  );
}

export default App