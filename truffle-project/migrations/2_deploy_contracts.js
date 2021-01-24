const CustomToken = artifacts.require("CustomToken");
const Marketplace = artifacts.require("Marketplace");

const initialSupply = 1000;
const tokenName = "Custom Token";
const tokenSymbol = "CTK";

module.exports = async function(deployer, networks, accounts) {
    await deployer.deploy(CustomToken, initialSupply, tokenName, tokenSymbol);
    const token = await CustomToken.deployed();
    await deployer.deploy(Marketplace, token.address,
        [{
            name: "manager0",
            reputation: 5,
            addr: accounts[1]
        }],
        [{
            name: "freelancer0",
            reputation: 5,
            expertise: "TEST",
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
            tokens: 0,
            addr: accounts[4]
        }],
        50
    )
};