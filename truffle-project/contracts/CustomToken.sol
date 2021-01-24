// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "../app/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../app/node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract CustomToken is ERC20, Ownable {
    constructor(uint _initialSupply, string memory name, string memory symbol) ERC20(name, symbol){
        _mint(_msgSender(), _initialSupply * (10**uint(decimals())));
    }
}