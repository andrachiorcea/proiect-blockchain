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
        uint256 id;
        string desctiption;
        uint256 DEV;
        uint256 REV;
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
    mapping(address => mapping(uint256 => uint256)) funderShares;
    mapping(address => mapping(uint256 => uint256)) freelancerShares;

    // OTHER FIELDS
    address owner;
    CustomToken public tokenContract;

    Product[] activeProducts;
    Product[] doneProducts;
    uint256 productIds = 0;

    constructor(
        CustomToken _tokenContract,
        Manager[] memory _managers,
        Freelancer[] memory _freelancers,
        Evaluator[] memory _evaluators,
        Funder[] memory _funders,
        uint256 numberTokens
    ) {
        owner = msg.sender;
        tokenContract = _tokenContract;
        require(
            _funders.length * numberTokens <= tokenContract.balanceOf(owner)
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
            return "evaluator";
        }
        return "nothing";
    }
}
