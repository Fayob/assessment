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
  // const [signer, setSigner] = useState(null)
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

  useEffect(() => {
    async function connection() {
      if (provider) {
        const signer = await provider.getSigner()
        // setSigner(signer)
        const contract = new ethers.Contract(conttractAddress, contractABI, signer)
        setContract(contract)
      }
    }
    connection()
  }, [provider])

  async function connectWallet() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
      setAccount(accounts[0])
      toast.success("Wallet connected successfully")
    } catch (error) {
      toast.error("Wallet connection failed ", error);
    }
  }

  async function getBalance() {
    if (contract) {
      const contractBalance = await contract.getBalance()
      setBalance(ethers.formatEther(contractBalance))
    } else {
      toast.error("Contract not found");
    }
  }

  async function handleDeposit() {
    if (contract) {
      const tx = await contract.deposit(ethers.parseEther(amount))
      await tx.wait()
      getBalance()
      toast.success("Deposit successful"); 
    } else {
      toast.error("Contract not found");
    }
  }

  async function handleWithdraw() {
    if (contract) {
      const tx = await contract.withdraw(ethers.parseEther(amount))
      await tx.wait()
      getBalance()
      toast.success("Successfully withdraw ", amount,"ETH");
    } else {
      toast.error("Contract not found");
    }
  }

  return (
    <div>
      <div> <ToastContainer position="top-right" autoClose={3000} /></div>
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