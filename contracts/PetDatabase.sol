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

    // The following function updates when a pet is either bought or sold [REQUIRES GAS]
    function updatePetAvailability(uint256 _petId, bool _isAvailable) external {
        require(_petId < pets.length, "Invalid pet ID"); // Validate pet ID
        
        pets[_petId].isAvailable = _isAvailable;
    }
}
