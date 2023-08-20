// SPDX-License-Identifier: MIT
const Adoption = artifacts.require("Adoption");
const PetDatabase = artifacts.require("PetDatabase");

module.exports = async function (deployer) {
  // Deploy the Adoption contract
  await deployer.deploy(Adoption);
  const adoptionInstance = await Adoption.deployed();

  // Deploy the PetDatabase contract, passing the address of the Adoption contract
  await deployer.deploy(PetDatabase, adoptionInstance.address);
};