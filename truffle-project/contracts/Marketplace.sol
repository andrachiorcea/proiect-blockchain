// SPDX-License-Identifier: MIT

pragma solidity ^0.7.4;
// pragma experimental ABIEncoderV2;

import "./CustomToken.sol";

contract Marketplace {

//SECTION DATA STRUCTURES
    struct Manager {
        string name;
        uint8 reputation;
        address addr;
    }

    struct Freelancer{
        string name;
        uint8 reputation;
        string expertise;
        address addr;
        uint[] chosenProductIds;
    }

    struct Evaluator{
        string name;
        uint8 reputation;
        string expertise;
        address addr;
    }

    struct Funder{
        uint numberOfTokens;
        address addr;
    }

    struct Product{
        uint id;
        string desctiption;
        uint DEV;
        uint REV;
        string expertise;
        address _manager;
        address payable _evaluator;
        address payable[] _funders;
        address payable[] _freelancers;
        ProductStage phase;
    }

    enum ProductStage {  
      FundsNeeded,        
      FreelancersNeeded,  
      FreelancersSelection,
      InProgress,
      WorkDone,
      InApproval,
      Done
    }

// MAPPINGS
    mapping(address => Manager) managers;
    mapping(address => Freelancer) freelancers;
    mapping(address => Evaluator) evaluators;
    mapping(address => Funder) funders;
    mapping(address => mapping (uint => uint)) funderShares;
    mapping(address => mapping (uint => uint)) freelancerShares;

// OTHER FIELDS
    address owner;
    CustomToken public tokens;

    Product[] activeProducts;
    Product[] doneProducts;
    uint productIds = 0;

    constructor(
        CustomToken _tokenContract,
        Manager[] memory _managers,
        Freelancer[] memory _freelancers,
        Evaluator[] memory _evaluators,
        Funder[] memory _funders,
        uint numberTokens)
    { 
        owner = msg.sender;
        tokenContract = _tokenContract;
        tokensToInit = tokens;
        require(_funders.length * tokens <= tokenContract.balanceOf(owner));

        for(uint i=0; i < _managers.length; i++){
            managers[_managers[i].addr] = _managers[i];
            managers[_managers[i].addr].reputation = 5;
        }

        for(uint i=0; i < _freelancers.length; i++){
            freelancers[_freelancers[i].addr] = _freelancers[i];
            freelancers[_freelancers[i].addr].reputation = 5;
        }

        for(uint i=0; i < _evaluators.length; i++){
            evaluators[_evaluators[i].addr] = _evaluators[i];
            evaluators[_evaluators[i].addr].reputation = 5;
        }

        for(uint i=0; i < _funders.length; i++){
            funders[_funders[i].addr] = _funders[i];
            fundersToInit.push(_funders[i]);
            // tokenContract.transferFrom(owner, _funders[i].addr, tokens);
        }
    }
}