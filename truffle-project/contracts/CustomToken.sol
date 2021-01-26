// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

//UNCOMMENT FOR TRUFFLE DAPP
import "../app/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../app/node_modules/@openzeppelin/contracts/access/Ownable.sol";

//UNCOMMENT FOR REMIX TESTING
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/token/ERC20/ERC20.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    constructor(uint _initialSupply, string memory name, string memory symbol) ERC20(name, symbol){
        _mint(_msgSender(), _initialSupply * (10**uint(decimals())));
    }
}