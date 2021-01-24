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

    struct Freelancer {
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
    mapping(address => mapping (uint => uint)) sponsorShares;
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

    modifier restrictByProductStatus(uint id, ProductStage stage) {
        Product memory prod = activeProducts[getProductIndexById(id)];
        require(prod.phase == stage, "Operation not allowed in this stage of product development");
        _;
    }

    function generateProductId() internal returns (uint) {
        currentProductid++;
        return currentProductid;
    }

    function getProductIndexById(uint id) public view
        returns (uint idx) 
    {
        for (uint i = 0; i < activeProducts.length; i++)
         {
            if (activeProducts[i].id == id) 
            {
                return i;
            }
        }
        return type(uint256).max;
    }

    function deleteProduct(uint id) internal {
        Product[] memory copyProducts;
        uint idx = 0;
        for (uint i=0; i<activeProducts.length; i++) {
            if (activeProducts[i].id != id) {
                copyProducts[idx++] = activeProducts[i];
            }
        }
        activeProducts = copyProducts;
    }
// =======================================REGISTER USER==========================================
    
    function registerManager(
        string memory _name) public
    {
        managers[msg.sender] = Manager({
            name: _name,
            reputation: 5,
            addr: msg.sender
        });
    }

// =======================================OPERATIONS==============================================

    function createProduct(
        string memory desc,
        uint devCost,
        uint revCost,
        string memory expertise) onlyManager() public
        {
          activeProducts.push(Product({
              id: generateProductId(),
              description: desc,
              DEV: devCost,
              REV: revCost,
              expertise: expertise,
              _manager: msg.sender,
              _evaluator: address(0x0),
              phase: ProductStage.FundsNeeded,
              _funders: new address payable[](0),
              _freelancers: new address payable[](0)
          }));
    }

    function removeProduct(uint id) onlyManager() 
    restrictByProductStatus(id, ProductStage.FundsNeeded) public {
        Product memory prod = activeProducts[getProductIndexById(id)];
        for (uint i = 0; i < prod._funders.length; i++) {
            if (prod._funders[i] != address(0x0)) {
                customTokenContract.approve(prod._funders[i], sponsorShares[prod._funders[i]][prod.id]);
                customTokenContract.transferFrom(address(this), prod._funders[i], sponsorShares[prod._funders[i]][prod.id]);
            }
        }
        deleteProduct(id);
    }

    // function fundProduct(uint id, uint fundingSum) onlyFunder() 
    // restrictByProductStatus(id, ProductStage.FundsNeeded) public
    // {
    //     Product storage prod = activeProducts[getProductIndexById(id)];
    //     if (prod.DEV + prod.REV > fundingSum) {
    //         // finantatorul trimite mai putin decat suma necesara
    //         tokenContract.transferFrom(msg.sender, address(this), fundingSum);
    //         activeProducts[productId]._funders.push(msg.sender);
    //         activeProducts[productId].funderShares[msg.sender] = fundingSum;
    //         // inca nu s a atins limita, produsul ramane in aceeasi etapa
    //     } else {
    //      // daca un finantator trimite exact suma necesara
    //      if (prod.DEV + prod.REV - fundingSum == 0) {
    //         tokenContract.transferFrom(msg.sender, address(this), fundingSum);
    //         activeProducts[productId]._funders.push(msg.sender);
    //         activeProducts[productId].funderShares[msg.sender] = fundingSum;
    //         // trece in urmatoarea etapa, nu se mai accepta funds
    //         prod.phase = ProductPhase.WaitingForApplications;
    //     } else {
    //        // trimite mai mult decat suma necesara, se trimite diferenta inapoi
    //        tokenContract.transferFrom(msg.sender, address(this), prod.DEV + prod.REV);
    //        activeProducts[productId]._funders.push(msg.sender);
    //        activeProducts[productId].funderShares[msg.sender] = fundingSum;
    //        prod.phase = ProductPhase.WaitingForApplications;
    //     }
    //   }
    // }

}