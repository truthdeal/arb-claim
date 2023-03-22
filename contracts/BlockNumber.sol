// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.16;


contract BlockNumber {


function blockNumber() public view returns(uint , uint) {

    return ( block.number , block.timestamp ) ;

}


}