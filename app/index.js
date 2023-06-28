import { ethers } from "./ethers-5.6.esm.min.js";
import { dsc_abi, dsc_address, dscE_address, dscE_abi, weth_address, weth_abi } from "./constant.js";

const tSupply = document.getElementById("tSupply");

const wethbalance = document.getElementById("wethbalance");
const nusdbalance = document.getElementById("nusdbalance");
const pricefeed = document.getElementById("pricefeed");
const pricefeedinverse = document.getElementById("pricefeedinverse");

const depositAmnt = document.getElementById("depositAmnt");
const mintAmnt = document.getElementById("mintAmnt");
const desc = document.getElementById("desc");
const burnAmnt = document.getElementById("burnAmnt");
const redeemAmnt = document.getElementById("redeemAmnt");

const depositBtn = document.getElementById("depositBtn");
const redeemBtn = document.getElementById("redeemBtn");


(async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(dsc_address, dsc_abi, provider)
  try {
    const transactionResponse = await contract.totalSupply();
    tSupply.innerText = ethers.utils.formatEther(transactionResponse).toString() + " nUSD ";
  } catch (error) {
    console.log(error)
  }
})()

let nUSDAmmount;
let wethAmmount;

depositAmnt.addEventListener('change', async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(dscE_address, dscE_abi, provider)
  try {
    const transactionResponse =
      await contract.getUsdValue(weth_address, ethers.utils.parseEther(depositAmnt.value));

    mintAmnt.value = `${ethers.utils.formatEther(transactionResponse.div(2))}`;
    desc.innerText = `(200% collateral) --------- ${depositAmnt.value} WETH => $ ${ethers.utils.formatEther(transactionResponse)}
    `;
    nUSDAmmount = transactionResponse.div(2).toString();
  } catch (error) {
    console.log(error)
  }
})

burnAmnt.addEventListener('change', async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(dscE_address, dscE_abi, provider)
  try {
    const transactionResponse =
      await contract.getTokenAmountFromUsd(weth_address, ethers.utils.parseEther(burnAmnt.value));

    wethAmmount = ethers.utils.formatEther(transactionResponse.mul(2));
    redeemAmnt.value = wethAmmount
  } catch (error) {
    console.log(error)
  }
})


connectButton.onclick = connect
depositBtn.onclick = Deposit
redeemBtn.onclick = Redeem

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
    connectButton.innerHTML = accounts[0]
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const weth = new ethers.Contract(weth_address, weth_abi, provider)
    const blnce = await weth.balanceOf(accounts[0])
    wethbalance.innerText = ethers.utils.formatEther(blnce).toString();

    const nusd = new ethers.Contract(dsc_address, dsc_abi, provider)
    const nusdblnce = await nusd.balanceOf(accounts[0])
    nusdbalance.innerText = ethers.utils.formatEther(nusdblnce).toString();

    const contract = new ethers.Contract(dscE_address, dscE_abi, provider)
    const feed =
      await contract.getUsdValue(weth_address, ethers.utils.parseEther("1"));
    pricefeed.innerText = " $ " + ethers.utils.formatEther(feed).toString();
    pricefeedinverse.innerText = " $ " + ethers.utils.formatEther(feed).toString();

  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function Redeem() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(dscE_address, dscE_abi, signer)
    const nusd = new ethers.Contract(dsc_address, dsc_abi, signer)
    try {
      const approvenusd = await nusd.approve(dscE_address, ethers.utils.parseEther(burnAmnt.value).toString())
      await approvenusd.wait(1);

      const transactionResponse = await contract.redeemCollateralForDsc(
        weth_address,
        ethers.utils.parseEther(wethAmmount).toString(),
        ethers.utils.parseEther(burnAmnt.value).toString(),
      )
      await listenForTransactionMine(transactionResponse, provider)
      console.log(transactionResponse);
    } catch (error) {
      console.log(error)
    }
  } else {
    redeemBtn.innerHTML = "Please install MetaMask"
  }
}

async function Deposit() {
  const ethAmount = depositAmnt.value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(dscE_address, dscE_abi, signer)
    const weth = new ethers.Contract(weth_address, dsc_abi, signer)
    try {
      const approveWeth = await weth.approve(dscE_address, ethers.utils.parseEther(depositAmnt.value).toString())
      await approveWeth.wait(1);
      const transactionResponse = await contract.depositCollateralAndMintDsc(
        weth_address,
        ethers.utils.parseEther(depositAmnt.value).toString(),
        nUSDAmmount
      )
      await listenForTransactionMine(transactionResponse, provider)
      console.log(transactionResponse);
    } catch (error) {
      console.log(error)
    }
  } else {
    depositBtn.innerHTML = "Please install MetaMask"
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      )
      resolve()
    })
  })
}