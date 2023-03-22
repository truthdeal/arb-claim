const {ethers , providers} = require('ethers') ; 
require('dotenv').config();
const { PRIVATE_KEY , API_URL , ARBITRUM_API_URL , ARBITRUM_NODE_AWS , 
      ARBITRUM_YOUTUBE , ARBITRUM_BLOCKVISION , ARBITRUM_BLOCKFI , AMAZON_ETHEREUM_URL ,
      ANKR_ETH_API_URL, ANKR_ARB_API_URL , QUICKNODE_ARB_API_URL} = process.env;


const ankrEthereum = new ethers.providers.JsonRpcProvider(ANKR_ETH_API_URL , 1) ;
const arbitrumProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_BLOCKFI , 42161) ;

//const alchemyArbitrum = new ethers.providers.JsonRpcProvider(ARBITRUM_API_URL , 42161) ;
//const awsEthereumNode = new ethers.providers.JsonRpcProvider(AMAZON_ETHEREUM_URL , 1) ;
//const awsArbitrumNode = new ethers.providers.JsonRpcProvider(ARBITRUM_NODE_AWS , 42161) ;
//const youtubeArbitrumNode = new ethers.providers.JsonRpcProvider(ARBITRUM_YOUTUBE , 42161) ;
//const blockvisionArbitrum = new ethers.providers.JsonRpcProvider(ARBITRUM_BLOCKVISION , 42161) ;
//const mainnetProvider = new ethers.providers.JsonRpcProvider(API_URL , 1) ;
//const ankrArbitrum = new ethers.providers.JsonRpcProvider(ANKR_ARB_API_URL , 42161) ;
//const quicknodeArbitrum = new ethers.providers.JsonRpcProvider(QUICKNODE_ARB_API_URL , 42161) ;



const ArbClaimContract = require("../artifacts/contracts/TokenDistributor.sol/TokenDistributor.json") ;
const claimContractAddress = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9" ;
const arbClaimContract = new ethers.Contract(claimContractAddress , ArbClaimContract.abi) ;

const BlockNumberContract = require("../artifacts/contracts/BlockNumber.sol/BlockNumber.json") ;
const blockNumberContractAddress = "0x7Fea7a319dd69d924Ae965069B43c5B55a3e02BA" ;
const blockNumberContract = new ethers.Contract(blockNumberContractAddress , BlockNumberContract.abi) ;

const signer = new ethers.Wallet(PRIVATE_KEY) ;
const account = signer.connect(arbitrumProvider) ; // To change arbitrum RPC provider should change this line

// Parameters 

let GASPRICE = 106 ; // Gas price as gwei
GASPRICE = ethers.utils.parseUnits( String(GASPRICE) , 9) ;

let arbClaimed = false ;
let waitTime = 1000 ; // as milliseconds


//Functions 
async function getEthereumBlockNumber() {
    console.log("Getting ETH Block Number") ;
    let date = Date.now() ;
    var mainnetLatest = await ankrEthereum.getBlockNumber() ;
    let secondDate = Date.now() ;
    console.log("ETH Mainnet blocknumber: " + mainnetLatest + " with " + (secondDate - date) + " ms lag.") ;
    console.log("") ;
    return mainnetLatest;
 }

 async function getArbitrumBlockNumber() {

    console.log("Getting Arbitrum Block Number") ;
    let date = Date.now() ;
    var latestBlock = await arbitrumProvider.getBlockNumber() ;
    let secondDate = Date.now() ;
    console.log("ARBITRUM blocknumber: " + latestBlock + " with " + (secondDate - date) + " ms lag.") ;
    console.log("") ;
    return latestBlock ;
 }

 async function getArbitrumL1BlockNumber() {

   console.log("Getting Ethereum L1 Block Number FROM ARBITRUM L2") ;
   let date = Date.now() ;
   const values = await blockNumberContract.connect(arbitrumProvider).blockNumber();
   let secondDate = Date.now() ;
   const arbL1BlockNumber = Number(values[0].toString())  ;
   const arbL1BlockTimestamp = Number(values[1].toString())  ;
   console.log("ARBITRUM blocknumber: " + arbL1BlockNumber + " with " + (secondDate - date) + " ms lag.") ;
   console.log("") ;
   return arbL1BlockNumber ;
}

 async function claimArb(_gasPrice) {

   console.log("Try to start claim") ;
   const options = { gasPrice: _gasPrice } ;
   const txArbClaim = await arbClaimContract.connect(account).claim(options);
   console.log("TX created. TX Hash --> " + txArbClaim) ;
   const receiptArbClaim = await txArbClaim.wait() ; // İşlemin mine edilmesine gerek var mı?
   console.log("CLAIMED SUCCESFULLY") ;
   return receiptArbClaim ; 


}

async function sendEth (_sender , _taker) {

   let tx = {
      from: _sender.address,
      to: _taker,
      value: ethers.utils.parseEther("0.0001"),
      gasPrice: GASPRICE
  } ;
  
  const receipt = await _sender.sendTransaction(tx) ;
  await receipt.wait() ;

  return receipt; 
}


async function main() {


   while (!arbClaimed) {
   
      let ethBlockNumber = await getArbitrumL1BlockNumber() ;

      if (ethBlockNumber <= 16890390) {
         let WaitTime = 5000 ; 
         console.log('Will get new block number in ' , WaitTime/1000 , "Seconds\n");
         await new Promise(resolve => setTimeout(resolve, (WaitTime)));
      } 
      else if (ethBlockNumber >= 16890391 && ethBlockNumber <= 16890398 ) {
         let WaitTime = 250 ; 
         console.log('Will get new block number in ' , WaitTime/1000 , "Seconds\n");
         await new Promise(resolve => setTimeout(resolve, (WaitTime)));
      }
      else if (ethBlockNumber >= 16890399) {

         if (ethBlockNumber >= 16890400) {
            const arbReceipt = await claimArb(GASPRICE);
            arbClaimed = true ;
         }

      }

   }




}

async function trialBlockNumberL1() {
   while(true) {
   let l1BlockNumber = await getArbitrumL1BlockNumber() ;
   let ethBlockNumber = await getEthereumBlockNumber() ;
   let WaitTime = 0 ; 
   console.log('Will get new block number in ' , WaitTime/1000 , "Seconds\n");
   await new Promise(resolve => setTimeout(resolve, (WaitTime)));
   }

// const receipt = sendEth(account , "0x01DD3a8ef7F2E6eb3721CA797b0C3bF47463843d") ;

} ;

trialBlockNumberL1() ;


//main() ;
