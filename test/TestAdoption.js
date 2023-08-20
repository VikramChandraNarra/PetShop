const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
  let adoptionInstance;

  beforeEach(async () => {
    adoptionInstance = await Adoption.new();
  });

  it("should allow a user to adopt a pet", async () => {
    const petId = 0;
    const adopter = accounts[0];

    await adoptionInstance.adopt(petId, adopter, { from: adopter });

    const adopterAddress = await adoptionInstance.getAdopter(petId);
    assert.equal(adopterAddress, adopter, "Adopter address should match");
  });

  it("should allow a user to disown a pet", async () => {
    const petId = 0;
    const adopter = accounts[0];

    await adoptionInstance.adopt(petId, adopter, { from: adopter });

    await adoptionInstance.disown(petId, { from: adopter });

    const adopterAddress = await adoptionInstance.getAdopter(petId);
    assert.equal(adopterAddress, "0x0000000000000000000000000000000000000000", "Adopter address should be set to zero");
  });

  it("should return the correct adopter for a pet", async () => {
    const petId = 0;
    const adopter = accounts[0];

    await adoptionInstance.adopt(petId, adopter, { from: adopter });

    const returnedAdopter = await adoptionInstance.getAdopter(petId);
    assert.equal(returnedAdopter, adopter, "Returned adopter address should match");
  });

  it("should return the list of adopters", async () => {
    const petId = 0;
    const adopter = accounts[0];

    await adoptionInstance.adopt(petId, adopter);

    const adoptersList = await adoptionInstance.getAdopters();
    assert.equal(adoptersList[petId], adopter, "Adopter address in the list should match");
  });

  it("should return address(0) for unadopted pet", async () => {
    const petId = 0;

    const adopterAddress = await adoptionInstance.getAdopter(petId);
    assert.equal(adopterAddress, "0x0000000000000000000000000000000000000000", "Adopter address should be set to zero");
  });
});
