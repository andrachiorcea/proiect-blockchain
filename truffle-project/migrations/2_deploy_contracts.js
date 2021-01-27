const CustomToken = artifacts.require("CustomToken");
const Marketplace = artifacts.require("Marketplace");

// const initialSupply = 1000000;
// const tokenName = "Custom Token";
// const tokenSymbol = "CTK";

module.exports = async function(deployer, networks, accounts) {
    // await deployer.deploy(CustomToken, initialSupply, tokenName, tokenSymbol);
    await deployer.deploy(CustomToken);
    const token = await CustomToken.deployed();
    const marketplace = await deployer.deploy(Marketplace, token.address,
        [{
            name: "manager0",
            reputation: 5,
            addr: accounts[0]
        }],
        [{
            name: "freelancer0",
            reputation: 5,
            expertise: "test",
            addr: accounts[1],
            chosenProductIds: []
        },
        {
            name: "freelancer1",
            reputation: 5,
            expertise: "test",
            addr: accounts[2],
            chosenProductIds: []
        }],
        [{
            name: "evaluator0",
            reputation: 5,
            expertise: "TEST",
            addr: accounts[3]
        }],
        [{
            numberOfTokens: 0,
            addr: accounts[4]
        },
        {
            numberOfTokens: 0,
            addr: accounts[5]
        }
        ],
        100
        );
};