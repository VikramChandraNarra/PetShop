//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract PetDatabase {
    struct Pet {
        string name;
        uint8 age;
        string breed;
        bool isAvailable;
        string image; // New field for the image of the pet
    }

    Pet[] public pets; // Array to store pets

    event PetAdded(
        uint256 indexed petId,
        string name,
        uint8 age,
        string breed,
        bool isAvailable,
        string image // Updated event to include image
    );

    // The following function adds a pet to the blockchain of pets [REQUIRES GAS]
    function addPet(
        string memory _name,
        uint8 _age,
        string memory _breed,
        string memory _image // New parameter for the image
    ) external {
        pets.push(Pet(_name, _age, _breed, true, _image)); // Push new pet to the array
        uint256 petId = pets.length - 1; // Calculate the pet ID

        emit PetAdded(petId, _name, _age, _breed, true, _image); // Emit the event
    }

    // The following function returns a single pet given a specific petId [DOES NOT REQUIRE GAS]
    function getPet(
        uint256 _petId
    )
        external
        view
        returns (string memory, uint8, string memory, bool, string memory)
    {
        require(_petId < pets.length, "Invalid pet ID"); // Validate pet ID

        Pet memory pet = pets[_petId];
        return (pet.name, pet.age, pet.breed, pet.isAvailable, pet.image);
    }

    // The following function returns all pets stored in the blockchain [DOES NOT REQUIRE GAS]
    function getAllPets() external view returns (Pet[] memory) {
        return pets;
    }

    // The following function returns an array of pet IDs that match the filtering criteria [DOES NOT REQUIRE GAS]
    function updatePetAvailability(uint256 _petId, bool _isAvailable) external {
        require(_petId < pets.length, "Invalid pet ID"); // Validate pet ID

        pets[_petId].isAvailable = _isAvailable;
    }

    function filterPets(
        string memory _name,
        uint8 _age,
        string memory _breed,
        bool _isAvailable
    ) external view returns (uint256[] memory) {
        uint256[] memory matchingPetIds = new uint256[](pets.length);
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < pets.length; i++) {
            bool nameMatches = bytes(_name).length == 0 ||
                keccak256(bytes(pets[i].name)) == keccak256(bytes(_name));
            bool ageMatches = _age == 0 || pets[i].age == _age;
            bool breedMatches = bytes(_breed).length == 0 ||
                keccak256(bytes(pets[i].breed)) == keccak256(bytes(_breed));
            bool availabilityMatches = _isAvailable == pets[i].isAvailable;

            if (
                nameMatches && ageMatches && breedMatches && availabilityMatches
            ) {
                matchingPetIds[matchingCount] = i;
                matchingCount++;
            }
        }

        uint256[] memory result = new uint256[](matchingCount);
        for (uint256 j = 0; j < matchingCount; j++) {
            result[j] = matchingPetIds[j];
        }

        return result;
    }
}
