const { ethers, Wallet } = require('ethers')
const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const { abi: SwapRouterABI} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const { getPoolImmutables, getPoolState } = require('./helpers')
const ERC20ABI = require('../artifacts/contracts/IERC20.sol/IERC20.json')
const fs = require('fs');

require('dotenv').config();
const { PRIV_KEY , PRIVATE_KEY , API_URL , ARBITRUM_API_URL , ARBITRUM_NODE_AWS , 
      ARBITRUM_YOUTUBE , ARBITRUM_BLOCKVISION , ARBITRUM_BLOCKFI , AMAZON_ETHEREUM_URL ,
      ANKR_ETH_API_URL, ANKR_ARB_API_URL , QUICKNODE_ARB_API_URL , ARBITRUM_HELSINKI} = process.env;


const ankrEthereum = new ethers.providers.JsonRpcProvider(ANKR_ETH_API_URL , 1) ;
const arbitrumProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_HELSINKI , 42161) ;


const signer = new ethers.Wallet(PRIV_KEY) ;
const account = signer.connect(arbitrumProvider) ; 


let GASPRICE = 10000000011 ; //wei 
//GASPRICE = ethers.utils.parseUnits( String(GASPRICE) , 9) ;
const inputAmount = 2250 // satış miktarı
const outputAmount = 9750 //


let started = false ;

//const poolAddress = "0x641C00A822e8b671738d32a431a4Fb6074E5c79d" // WETH/USDT // değiştirilecek ARB USDC ile
const poolAddress = "0xa8328bf492ba1b77ad6381b3f7567d942b000baf" // ARB USDC
const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

const name0 = 'ARBITRUM'
const symbol0 = 'ARB'
const decimals0 = 18
const address0 = '0x912CE59144191C1204E64559FE8253a0e49E6548'

const name1 = 'USD Coin (Arb1)'
const symbol1 = 'USDC'
const decimals1 = 6
const address1 = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'

const name2 = 'TETHER USD'
const symbol2 = 'USDT'
const decimals2 = 6
const address2 = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'

const name3 =  'Wrapped Ether'
const symbol3 = 'WETH'
const decimals3 = 18
const address3 = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'

async function main() {
    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3PoolABI,
      arbitrumProvider
    )

    const immutables = await getPoolImmutables(poolContract)
    const state = await getPoolState(poolContract , arbitrumProvider)
 
    const swapRouterContract = new ethers.Contract(
        swapRouterAddress,
        SwapRouterABI,
        arbitrumProvider
      )


    const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        decimals0 // buranın input tokena göre değiştirilmesi lazım
      )
    
    const amountOut = ethers.utils.parseUnits(
        outputAmount.toString(),
        decimals1 // buranın input tokena göre değiştirilmesi lazım
      )
    
    
      // bu kısım değiştirilebilir approve vermek için
      /*
      let approvalAmount = (amountIn.mul(10000) ).toString() ;
      //approvalAmount = ethers.utils.parseUnits(approvalAmount , decimals0);
      const tokenContract0 = new ethers.Contract(
        address0,
        ERC20ABI.abi,
        arbitrumProvider
      )


      const approvalResponse = await tokenContract0.connect(account).approve(
        swapRouterAddress,
        approvalAmount
      )
      */


      while (!started) {

        let rawdata = fs.readFileSync('./config.json');
        let stats = JSON.parse(rawdata);
        console.log(stats.start);
        started = stats.start;

        await new Promise(resolve => setTimeout(resolve, (15)));

      }

      const params = {
        tokenIn: immutables.token0,
        tokenOut: immutables.token1,
        fee: immutables.fee,
        recipient: account.address,
        deadline: Math.floor(Date.now() / 1000) + (60 * 10),
        amountIn: amountIn,
        amountOutMinimum: amountOut,
        sqrtPriceLimitX96: 0,
      }

      const options = { gasPrice: GASPRICE , gasLimit: ethers.utils.hexlify(2500000)} ;
      const transaction = swapRouterContract.connect(account).exactInputSingle(
        params, options
      ).then(transaction => {
        console.log(transaction)
      })

  }
  
  



  main()



