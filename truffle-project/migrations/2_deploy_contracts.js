var MyAuctionContract = artifacts.require("MyAuction");

module.exports = function(deployer) {

    deployer.deploy(MyAuctionContract, 1, "0xD99F7AeB911ede429D446533edc5811D46989e42", "Dacia", "97531");

};
