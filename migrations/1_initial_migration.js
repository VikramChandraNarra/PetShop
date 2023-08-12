const PetDatabase = artifacts.require("PetDatabase")

module.exports = function (deployer) {
    deployer.deploy(PetDatabase)
}