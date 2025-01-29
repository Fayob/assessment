import { useEffect, useState } from "react"
import { ethers } from "ethers"
import contractABI from "./abi.json"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  const conttractAddress = "0xAC7D133Fa5A84b26701B95c083695fBFD92ebE5b"

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
    } else {
      toast.error("Please install an ethreum compatible wallet");
    }
  }, [])

  async function connectWallet() {
    if (provider) {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(conttractAddress, contractABI, signer)
      setContract(contract)
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
      setAccount(accounts[0])
      toast.success("Wallet connected successfully")
    } catch (error) {
      toast.error("Wallet connection failed");
    }
  }

  async function getBalance() {
    if (contract) {
      const contractBalance = await contract.getBalance()
      setBalance(ethers.formatEther(contractBalance))      
    } else {
      toast.error("Please connect your wallet");
    }
  }

  async function handleDeposit() {
    if (contract) {
      const tx = await contract.deposit(ethers.parseEther(amount))
      await tx.wait()
      getBalance()
      toast.success(<p>Your Deposit of ${amount}ETH was successful</p>); 
    } else {
      toast.error("Please connect your wallet");
    }
  }

  async function handleWithdraw() {
    if (contract) {
      const tx = await contract.withdraw(ethers.parseEther(amount))
      await tx.wait()
      getBalance()
      toast.success(<p>Successfully withdraw ${amount} ETH</p>);
    } else {
      toast.error("Please connect your wallet");
    }
  }

  return (
    <div>
      <div> <ToastContainer position="top-right" autoClose={2000} /></div>
      <h2>DApp Mini App</h2>
      {account ? <p>Connected to {account.slice(0, 6)}...{account.slice(account.length-6)} </p> :
      <button onClick={connectWallet}> Connect Wallet </button>
      }
      <div >
        <p>Balance: {balance} ETH</p>
        <button onClick={getBalance}>Refresh Balance</button><br />
        <div>
          <input 
            type="text" 
            placeholder="Enter amount of ETH" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
        </div>
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  )
}

export default App