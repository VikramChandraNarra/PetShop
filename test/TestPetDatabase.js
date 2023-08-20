const PetDatabase = artifacts.require("PetDatabase");
const Adoption = artifacts.require("Adoption");

contract("PetDatabase", (accounts) => {
  let petDatabaseInstance;
  let adoptionInstance;

  beforeEach(async () => {
    adoptionInstance = await Adoption.new();
    petDatabaseInstance = await PetDatabase.new(adoptionInstance.address);
  });

  it("should add a pet and retrieve its details", async () => {
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");

    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);

    const petDetails = await petDatabaseInstance.getPet(0);

    assert.equal(petDetails[0], name, "Pet name doesn't match");
    assert.equal(petDetails[1].toNumber(), age, "Pet age doesn't match");
    assert.equal(petDetails[2], breed, "Pet breed doesn't match");
    assert.equal(petDetails[3], true, "Pet availability is incorrect");
    assert.equal(petDetails[4], image, "Pet image doesn't match");
    assert.equal(petDetails[5], location, "Pet location doesn't match");
    assert.equal(petDetails[7].toString(), adoptionFee, "Pet adoption fee doesn't match");
  });

  it("should adopt a pet and mark it as unavailable", async () => {
    // Add a pet first
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");
    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);

    const adoptionAddress = await petDatabaseInstance.adoptionInstance();

    const adoptionInstance = await Adoption.at(adoptionAddress);

    const adopter = accounts[0];
    const owner = accounts[3]


    await petDatabaseInstance.adoptPet(0, owner, { value: adoptionFee });

    const petDetails = await petDatabaseInstance.getPet(0);
    assert.equal(petDetails[3], false, "Pet should not be available for adoption after adoption");

    const petAdopter = await adoptionInstance.getAdopter(0);
    assert.equal(petAdopter, adopter, "Adopter address should match");


  });

  it("should get adopted pets by an adopter", async () => {
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");
    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);

    const adopter = accounts[0];
    const owner = accounts[3]

    await petDatabaseInstance.adoptPet(0, adopter, { value: adoptionFee });

    const adoptedPetIds = await petDatabaseInstance.getPetsAdopted({ from: adopter });

    assert.equal(adoptedPetIds.length, 1, "Number of adopted pets should be 1");
    assert.equal(adoptedPetIds[0].toNumber(), 0, "Adopted pet ID should match");
  });
  it("should add a voter to a pet", async () => {
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");
    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);
  
    const petId = 0;
  
    await petDatabaseInstance.addVoter(petId, { from: accounts[0] });
  
    const petDetails = await petDatabaseInstance.getPet(petId);
  
    assert.equal(petDetails[6].length, 1, "Number of voters should be 1");
    assert.equal(petDetails[6][0], accounts[0], "Voter address should match");
  });

  it("should remove a voter from a pet", async () => {
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");
    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);

    const petId = 0;

    await petDatabaseInstance.addVoter(petId, { from: accounts[0] });

    await petDatabaseInstance.removeVoter(petId, { from: accounts[0] });

    const pet = await petDatabaseInstance.getPet(petId);

    assert.equal(pet[6].length, 0, "Number of voters should be 0");
  });

  it("should check if a user has voted for a pet", async () => {
    const name = "Fluffy";
    const age = 2;
    const breed = "Golden Retriever";
    const image = "fluffy.jpg";
    const location = "Park";
    const adoptionFee = web3.utils.toWei("1", "ether");
    await petDatabaseInstance.addPet(name, age, breed, image, location, adoptionFee);

    const petId = 0;

    await petDatabaseInstance.addVoter(petId, { from: accounts[0] });

    const hasVoted = await petDatabaseInstance.hasVoted(petId, { from: accounts[0] });

    assert.isTrue(hasVoted, "User should have voted");
  });

  it("should filter pets based on criteria", async () => {
    await petDatabaseInstance.addPet("Fluffy", 2, "Golden Retriever", "fluffy.jpg", "Park", web3.utils.toWei("1", "ether"));
    await petDatabaseInstance.addPet("Buddy", 3, "Labrador", "buddy.jpg", "Home", web3.utils.toWei("1", "ether"));
    await petDatabaseInstance.addPet("Charlie", 1, "Poodle", "charlie.jpg", "Beach", web3.utils.toWei("1", "ether"));

    const ageFilter = 2;
    const filteredIds = await petDatabaseInstance.filterPets("", ageFilter, "", true, "");
    assert.equal(filteredIds.length, 1, "Number of filtered pets should be 1");
    assert.equal(filteredIds[0].toNumber(), 0, "Filtered pet ID should match");

    const locationFilter = "Park";
    const filteredIdsByLocation = await petDatabaseInstance.filterPets("", 0, "", true, locationFilter);
    assert.equal(filteredIdsByLocation.length, 1, "Number of filtered pets should be 1");
    assert.equal(filteredIdsByLocation[0].toNumber(), 0, "Filtered pet ID should match");
  });
});
