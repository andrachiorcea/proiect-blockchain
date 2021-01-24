// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

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
        string description;
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
    CustomToken public customTokenContract;
    Product[] activeProducts;
    Product[] finishedProducts;
    uint currentProductid = 0;

    constructor(
        CustomToken tokenContract,
        Manager[] memory _managers,
        Freelancer[] memory _freelancers,
        Evaluator[] memory _evaluators,
        Funder[] memory _funders,
        uint numberTokens)
    { 
        owner = msg.sender;
        customTokenContract = tokenContract;
        require(_funders.length * numberTokens <= tokenContract.balanceOf(owner), 
        "The tokens that you want to allocate are more than the total number of tokens in the contract");

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
            tokenContract.approve(funders[_funders[i].addr].addr, numberTokens);
            tokenContract.transfer(funders[_funders[i].addr].addr, numberTokens);
        }
    }

// =====================================HELPERS=====================================

    modifier onlyOwner(){
        require(msg.sender == owner, "Only the owner has rights for this operation; please dont waste gas");
        _;
    }

    modifier onlyManager() {
        require(managers[msg.sender].addr != address(0x0), "Function rsetricted to managers");
        _;
    }

    modifier onlyFreelancer() {
        require(freelancers[msg.sender].addr != address(0x0), "Function restricted to freelancers");
        _;
    }

    modifier onlyEvaluator() {
        require(evaluators[msg.sender].addr != address(0x0), "Function restricted to evaluators");
        _;
    }
       
    modifier onlyFunder() {
        require(funders[msg.sender].addr != address(0x0), "Function restricted to funders");
        _;
    }

    function generateProductId() internal returns (uint) {
        currentProductid++;
        return currentProductid;
    }

// =========================================================================================

    function fundProduct(uint tokens) onlyOwner() external{
        customTokenContract.transferFrom(msg.sender, address(this), tokens);
    }

    function createProduct(
        string memory desc,
        uint devCost,
        uint revCost,
        string memory expertise) onlyManager() public
        {
          Product storage newProduct;
          newProduct.id = generateProductId();
          newProduct.description = desc;
          newProduct.DEV = devCost;
          newProduct.REV = revCost;
          newProduct.expertise = expertise;
          newProduct._manager = msg.sender;
          newProduct._evaluator = address(0x0);
          newProduct.phase = ProductStage.FundsNeeded;
          activeProducts.push(newProduct);
    }
}