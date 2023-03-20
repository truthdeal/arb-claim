const {ethers , providers} = require('ethers') ; 
require('dotenv').config();
const { API_URL , ARBITRUM_API_URL} = process.env;


var arbitrumProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_API_URL) ;
var mainnetProvider = new ethers.providers.JsonRpcProvider(API_URL) ;

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

    var latestBlock = await arbitrumProvider.getBlockNumber() ;

    return latestBlock ;
 }


async function main() {


let ethBlockNumber = await getEthereumBlockNumber() ;
   


}

main() ;
