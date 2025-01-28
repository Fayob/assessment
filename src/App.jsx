import { useState } from 'react'
import { ethers } from "ethers";
import abi from './abi.json'
import toast from "toastify-js"
import { useEffect } from 'react';

function App() {
  const [balance, setBalance] = useState("")
  const contractAddress = "0xAC7D133Fa5A84b26701B95c083695fBFD92ebE5b"

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  async function handleDeposit() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        toast({text: "Deposit Successful"}).showToast();
        updateBalance();
      } catch (error) {
        console.log(error);
        toast({text: "Deposit failed"}).showToast();
      }
    }
  }

  async function handleWithdraw() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)

      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        alert("Withdrawal successful!");
        updateBalance();
      } catch (error) {
        console.error("Withdrawal failed:", error);
      }
    };
  
    const updateBalance = async () => {
      if (contract && signer) {
        const userAddress = await signer.getAddress();
        const userBalance = await contract.balanceOf(userAddress);
        setBalance(ethers.utils.formatEther(userBalance));
      }
    };
  }

  async function handleBalance() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccounts();

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abi, provider)

      try {
        const bal = await contract.getBalance();
        setBalance(bal)
      } catch (error) {
        console.error("Withdrawal failed:", error);
      }
    };
  }

  useEffect(() => {
    handleBalance()
  }, [balance])

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-xl font-bold">Deposit and Withdraw</h1>
      <p>Your Balance: {balance} ETH</p>
      <input
        type="text"
        placeholder="Enter amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border rounded"
      />
      <div className="flex space-x-4">
        <button onClick={handleDeposit} className="px-4 py-2 bg-green-500 text-white rounded">
          Deposit
        </button>
        <button onClick={handleWithdraw} className="px-4 py-2 bg-blue-500 text-white rounded">
          Withdraw
        </button>
      </div>
    </div>
  )
}

export default App
