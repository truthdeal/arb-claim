exports.getPoolImmutables = async (poolContract) => {
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee()
    ])
  
    const immutables = {
      token0: token0,
      token1: token1,
      fee: fee
    }
    return immutables
  }
  
  exports.getPoolState = async (poolContract , _provider) => {
    const slot = await poolContract.connect(_provider).slot0()
  
    const state = {
      sqrtPriceX96: slot[0]
    }
  
    return state
  }