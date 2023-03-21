const {ethers , providers} = require('ethers') ; 
require('dotenv').config();
const { PRIVATE_KEY , API_URL , ARBITRUM_API_URL , ARBITRUM_NODE_AWS , 
      ARBITRUM_YOUTUBE , ARBITRUM_BLOCKVISION , ARBITRUM_BLOCKFI} = process.env;


var arbitrumProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_API_URL , 42161) ;
var awsArbitrumNode = new ethers.providers.JsonRpcProvider(ARBITRUM_NODE_AWS , 42161) ;
var youtubeArbitrumNode = new ethers.providers.JsonRpcProvider(ARBITRUM_YOUTUBE , 42161) ;
var blockvisionArbitrum = new ethers.providers.JsonRpcProvider(ARBITRUM_BLOCKVISION , 42161) ;
var blockfiArbitrum = new ethers.providers.JsonRpcProvider(ARBITRUM_BLOCKFI , 42161) ;
var mainnetProvider = new ethers.providers.JsonRpcProvider(API_URL , 1) ;


const ArbClaimContract = require("../artifacts/contracts/TokenDistributor.sol/TokenDistributor.json") ;
const claimContractAddress = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9" ;
const arbClaimContract = new ethers.Contract(claimContractAddress , ArbClaimContract.abi) ;

const signer = new ethers.Wallet(PRIVATE_KEY) ;
const account = signer.connect(arbitrumProvider) ; // To change arbitrum RPC provider should change this line

// Parameters 

let GASPRICE = 30 ; // Gas price as gwei
GASPRICE = ethers.utils.parseUnits( String(GASPRICE) , 9) ;

let arbClaimed = false ;
let waitTime = 1000 ; // as milliseconds


//Functions 
async function getEthereumBlockNumber() {
    console.log("Getting ETH Block Number") ;
    let date = Date.now() ;
    var mainnetLatest = await mainnetProvider.getBlockNumber() ;
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

 async function claimArb(_gasPrice) {

   console.log("Try to start claim") ;
   const options = { gasPrice: _gasPrice } ;
   const txArbClaim = await arbClaimContract.connect(account).claim(options);
   console.log("TX created. TX Hash --> " + txArbClaim) ;
   const receiptArbClaim = await txArbClaim.wait() ; // İşlemin mine edilmesine gerek var mı?
   console.log("CLAIMED SUCCESFULLY") ;
   return receiptArbClaim ; 


}



async function main() {


   while (!arbClaimed) {
   
      let ethBlockNumber = await getEthereumBlockNumber() ;

      if (ethBlockNumber <= 16890390) {
         waitTime = 5000 ; 
      } 
      else if (ethBlockNumber >= 16890391 && ethBlockNumber <= 16890399 ) {
         waitTime = 250 ; 
      }
      else if (ethBlockNumber >= 16890400) {
         const arbReceipt = await claimArb(GASPRICE);
         arbClaimed = true ;
      }

      if (!arbClaimed) {
         console.log('Will get new block number in ' , waitTime/1000 , "Seconds\n");
         await new Promise(resolve => setTimeout(resolve, (waitTime)));
      }

   }


let arbBlockNumber = await getArbitrumBlockNumber() ;



}

main() ;
