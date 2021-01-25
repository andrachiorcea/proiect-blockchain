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
        uint256[] chosenProductIds;
    }

    struct Evaluator {
        string name;
        uint8 reputation;
        string expertise;
        address addr;
    }

    struct Funder {
        uint256 numberOfTokens;
        address addr;
    }

    struct Product {
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

    // Events
    event checkUserStatus(string _message);

    // MAPPINGS
    mapping(address => Manager) managers;
    mapping(address => Freelancer) freelancers;
    mapping(address => Evaluator) evaluators;
    mapping(address => Funder) funders;
    mapping (address => mapping (uint => uint)) funderShares;
    mapping (address => mapping (uint => uint)) freelancerShares;

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
        uint256 numberTokens
    ) {
        owner = msg.sender;
        customTokenContract = tokenContract;
        require(
            _funders.length * numberTokens <= tokenContract.balanceOf(owner),
            "The tokens that you want to allocate are more than the total number of tokens in the contract"
        );

        for (uint256 i = 0; i < _managers.length; i++) {
            managers[_managers[i].addr] = _managers[i];
            managers[_managers[i].addr].reputation = 5;
        }

        for (uint256 i = 0; i < _freelancers.length; i++) {
            freelancers[_freelancers[i].addr] = _freelancers[i];
            freelancers[_freelancers[i].addr].reputation = 5;
        }

        for (uint256 i = 0; i < _evaluators.length; i++) {
            evaluators[_evaluators[i].addr] = _evaluators[i];
            evaluators[_evaluators[i].addr].reputation = 5;
        }
    }

    function getUserInfo() public view returns (string memory) {
        Manager memory manager = managers[msg.sender];

        if (manager.reputation > 0) {
            return "manager";
        }

        Freelancer memory freelancer = freelancers[msg.sender];

        if (freelancer.reputation > 0) {
            return "freelancer";
        }

        Evaluator memory evaluator = evaluators[msg.sender];

        if (evaluator.reputation > 0) {
            return "freelancer";
        }

        return "nothing";
    }

    // =====================================HELPERS=====================================

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the owner has rights for this operation; please dont waste gas"
        );
        _;
    }

    modifier onlyManager() {
        require(
            managers[msg.sender].addr != address(0x0),
            "Function rsetricted to managers"
        );
        _;
    }

    modifier onlyFreelancer() {
        require(
            freelancers[msg.sender].addr != address(0x0),
            "Function restricted to freelancers"
        );
        _;
    }

    modifier onlyEvaluator() {
        require(
            evaluators[msg.sender].addr != address(0x0),
            "Function restricted to evaluators"
        );
        _;
    }

    modifier onlyFunder() {
        require(
            funders[msg.sender].addr != address(0x0),
            "Function restricted to funders"
        );
        _;
    }

    modifier onlyEvaluatorAndFreelancer() {
        require(funders[msg.sender].addr != address(0x0) && evaluators[msg.sender].addr != address(0x0),
        "Function restricted to evaluators and freelancers");
        _;
    }

    modifier restrictByProductStatus(uint id, ProductStage stage) {
        Product memory prod = activeProducts[getProductIndexById(id)];
        require(
            prod.phase == stage,
            "Operation not allowed in this stage of product development"
        );
        _;
    }

    modifier isEligibleForEvaluatorInscription(uint productId) {
        uint productIdx = getProductIndexById(productId);
        require(activeProducts[productIdx]._manager != address(0x0), "The chosen product is not in the active products list");
        require(activeProducts[productIdx]._evaluator == address(0x0), "The chosen product already has an evaluator");
        _;
    }

    function generateProductId() internal returns (uint) {
        currentProductid++;
        return currentProductid;
    }

    function getProductIndexById(uint id) public view returns (uint idx) {
        for (uint i = 0; i < activeProducts.length; i++) {
            if (activeProducts[i].id == id) {
                return i;
            }
        }
        revert("The product does not exist");
    }

    function deleteProduct(uint id) internal {
        Product[] memory copyProducts;
        uint idx = 0;
        for (uint i = 0; i < activeProducts.length; i++) {
            if (activeProducts[i].id != id) {
                copyProducts[idx++] = activeProducts[i];
            }
        }
        activeProducts = copyProducts;
    }

    function searchExistingFunderForProduct(Product calldata prod) public view returns (bool, uint){
        for(uint i=0; i < prod._funders.length; i++){
            if(prod._funders[i] == msg.sender) {
                return (true, i);
            }
        }
        return (false, 0);
    }

// =======================================REGISTER USER==========================================
    
    function registerManager(
        string calldata _name) external
    {
        require(bytes(_name).length != 0, "You must provide a name");
        Manager memory manager = managers[msg.sender];
        require(manager.reputation == 0, "You are already registered as a manager");

        managers[msg.sender] = Manager({
            name: _name,
            reputation: 5,
            addr: msg.sender
        });
    }

    function registerFreelancer(
        string calldata _name, string calldata _expertise, uint256 _reputation) external
    {
        Freelancer memory freelancer = freelancers[msg.sender];
        require(freelancer.reputation == 0, "You are alreay registered as a freelancer");
        require(bytes(_name).length > 0, "You must provide a name");
        require(bytes(_expertise).length > 0, "You must provide an expertise");

        freelancers[msg.sender] = Freelancer({
            name: _name,
            reputation: 5,
            addr: msg.sender,
            expertise: _expertise,
            chosenProductIds: new uint[](0)
        });
    }

    function registerEvaluator(string calldata _name, string calldata _expertise) external 
    {
        Evaluator memory evaluator = evaluators[msg.sender];
        require(evaluator.reputation == 0, "You are alreay registered as an evalatuator");
        require(bytes(_name).length > 0, "You must provide a name");
        require(bytes(_expertise).length > 0, "You must provide an expertise domain");

        evaluators[msg.sender] = Evaluator({
            name: _name,
            reputation: 5,
            addr: msg.sender,
            expertise: _expertise
        });
    }

    struct Funder{
        uint numberOfTokens;
        address addr;
    }

    function registerFunder(uint _numberOfTokens) {
        Funder memory funder = funders[msg.sender];
        require(_numberOfTokens > 0, "You must provide some tokens");
        require(funder.numberOfTokens == 0, "You are alreay registered as a funder");

        funders[msg.sender] = Funder ({
            numberOfTokens: _numberOfTokens,
            addr: msg.sender
        });
    }

// =======================================OPERATIONS==============================================

    function createProduct(
        string calldata desc,
        uint devCost,
        uint revCost,
        string calldata expertise) onlyManager() public
        {
          require(bytes(desc).length > 0, "You must provide a description");
          require(bytes(expertise).length > 0, "You must provide an expertise");
          require(devCost > 0, "Dev cost must be > 0"); 
          require(revCost > 0, "Rev cost must be > 0");   
          
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
                customTokenContract.approve(prod._funders[i], funderShares[prod._funders[i]][prod.id]);
                customTokenContract.transferFrom(address(this), prod._funders[i], funderShares[prod._funders[i]][prod.id]);
            }
        }
        deleteProduct(id);
    }

    function fundProduct(uint productId, uint fundingSum) onlyFunder() 
    restrictByProductStatus(productId, ProductStage.FundsNeeded) public
    {
        uint productIdx = getProductIndexById(productId);
        Product storage prod = activeProducts[productIdx];
        bool exists;
        uint idx;
        (exists, idx) = searchExistingFunderForProduct(prod);
        if (prod.DEV + prod.REV >= fundingSum) {
            customTokenContract.transferFrom(msg.sender, address(this), fundingSum);
            if (exists) {
                funderShares[msg.sender][productId] += fundingSum;
            }
            else {
                activeProducts[productIdx]._funders.push(msg.sender);
                funderShares[msg.sender][productId] = fundingSum;
            }
        } else {
         if (prod.DEV + prod.REV == fundingSum) {
            prod.phase = ProductStage.FreelancersNeeded;
        } else {
           uint neededFunds = fundingSum - prod.DEV + prod.REV;
           customTokenContract.transferFrom(msg.sender, address(this), neededFunds);
           if (exists) {
                funderShares[msg.sender][productId] += neededFunds;
            }
            else {
                activeProducts[productIdx]._funders.push(msg.sender);
                funderShares[msg.sender][productId] = neededFunds;
            }
           prod.phase = ProductStage.FreelancersNeeded;
        }
      }
    }

    function withdrawFund(uint productId, uint withdrawSum) onlyFunder()
     restrictByProductStatus(productId, ProductStage.FundsNeeded) public {
        uint productIdx = getProductIndexById(productId);

        require(funderShares[msg.sender][productIdx] > 0, "Cannot withdraw funds from this project");
        require(withdrawSum <= funderShares[msg.sender][productIdx], "Sum to withdrawis bigger than contribution");

        customTokenContract.transferFrom(address(this), msg.sender, withdrawSum);
        if (withdrawSum == funderShares[msg.sender][productIdx]) {
            delete funderShares[msg.sender][productIdx];
        }
    }

    function consultFinancedProducts() onlyEvaluatorAndFreelancer() public view
    returns (Product[] memory financedProducts) {
        uint j = 0;
        for (uint i = 0; i < activeProducts.length; i++) {
            if (activeProducts[i].phase == ProductStage.FreelancersNeeded) {
                financedProducts[j] = activeProducts[i];
                j = j+1;
            }
        }
        return financedProducts;
    }

    function registerToEvaluate(uint productId) 
    onlyEvaluator() isEligibleForEvaluatorInscription(productId)
    restrictByProductStatus(productId, ProductStage.FreelancersNeeded) public {
        activeProducts[getProductIndexById(productId)]._evaluator = msg.sender;
    }

    function applyToWorkForProduct(uint productId, uint salary) public
    onlyFreelancer() restrictByProductStatus(productId, ProductStage.FreelancersNeeded) {
        uint productIdx = getProductIndexById(productId);
        Product storage prod = activeProducts[productIdx];
        require(activeProducts[productIdx]._manager != address(0x0), "The chosen product is not in the active products list");
        require(prod.DEV <= salary, "We can't pay you this much!");

        freelancerShares[msg.sender][productIdx] = salary;
        freelancers[msg.sender].chosenProductIds.push(productId);
    } 

    // function acceptFreelancerTeam(uint productId) onlyManager()
    // restrictByProductStatus(productId, ProductStage.FreelancersNeeded) public {
        //de setat un minim de freelanceri + sa fie atinsa suma DEV
    }
}
