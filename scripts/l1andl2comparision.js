
const {ethers , providers} = require('ethers') ; 
require('dotenv').config();
const { PRIVATE_KEY , API_URL , ARBITRUM_API_URL , ARBITRUM_NODE_AWS , 
      ARBITRUM_YOUTUBE , ARBITRUM_BLOCKVISION , ARBITRUM_BLOCKFI , AMAZON_ETHEREUM_URL ,
      ANKR_ETH_API_URL, ANKR_ARB_API_URL , QUICKNODE_ARB_API_URL} = process.env;




var arbitrumProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_API_URL , 42161) ;
var mainnetProvider = new ethers.providers.JsonRpcProvider(API_URL , 1) ;

const BlockNumberContract = require("../artifacts/contracts/BlockNumber.sol/BlockNumber.json") ;
const blockNumberContractAddress = "0x7Fea7a319dd69d924Ae965069B43c5B55a3e02BA" ;
const blockNumberContract = new ethers.Contract(blockNumberContractAddress , BlockNumberContract.abi) ;


async function main() {
    
    const values = await blockNumberContract.connect(arbitrumProvider).blockNumber();
    const arbL1BlockNumber = Number(values[0].toString())  ;
    const arbL1BlockTimestamp = Number(values[1].toString())  ;
    console.log( arbL1BlockNumber , arbL1BlockTimestamp  ) ;
    const block = await mainnetProvider.getBlockNumber() ;
    let blockTimestamp = await mainnetProvider.getBlock(block); 
    blockTimestamp = blockTimestamp.timestamp ;
    console.log( block , blockTimestamp ) ;

}

main() ;