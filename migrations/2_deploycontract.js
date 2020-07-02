const Migrations = artifacts.require("Subscription");

module.exports = function(deployer) {
  deployer.deploy(Subscription);
};
