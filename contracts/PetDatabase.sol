//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract PetDatabase {

    uint256 public petCount;

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
        petCount++;
        pets[petCount] = Pet(_name, _age, _breed, true, _image); // Updated to include image
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
        Pet memory pet = pets[_petId];
        return (pet.name, pet.age, pet.breed, pet.isAvailable, pet.image); // Updated return values
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



// pragma solidity ^0.8.19;

// contract PetDatabase {
//     uint256 public petCount;

//     struct Pet {
//         string name;
//         uint8 age;
//         string breed;
//         bool isAvailable;
//         string image; // New field for the image of the pet
//     }
//     mapping(uint256 => Pet) public pets;

//     event PetAdded(
//         uint256 indexed petId,
//         string name,
//         uint8 age,
//         string breed,
//         bool isAvailable,
//         string image // Updated event to include image
//     );

//     // The following function adds a pet to to the blockchain of pets [REQUIRES GAS]
//     function addPet(
//         string memory _name,
//         uint8 _age,
//         string memory _breed,
//         string memory _image // New parameter for the image
//     ) external {
//         petCount++;
//         // pets[petCount] = Pet(_name, _age, _breed, true, _image); // Updated to include image
//         pets[petCount] = Pet("vikky", 14, "cat", true, "random ulr"); // Updated to include image

//         emit PetAdded(petCount, _name, _age, _breed, true, _image); // Updated to include image
        
//     }

//     // The following function returns a single pet given a specific petId [DOES NOT REQUIRE GAS]
//     function getPet(
//         uint256 _petId
//     )
//         external
//         view
//         returns (string memory, uint8, string memory, bool, string memory)
//     {
//         // Updated return values
//         Pet memory pet = pets[_petId];
//         return (pet.name, pet.age, pet.breed, pet.isAvailable, pet.image); // Updated return values
//     }

//     // The following function returns all pets stored in the blockchain [DOES NOT REQUIRE GAS]
//     function getAllPets() external view returns (Pet[] memory) {
//         Pet[] memory allPets = new Pet[](petCount);

//         for (uint256 i = 1; i <= petCount; i++) {
//             allPets[i - 1] = pets[i];
//         }

//         return allPets;
//     }

//     // The following function updates when a pet is either bought or sold [REQUIRES GAS]

//     function updatePetAvailability(uint256 _petId, bool _isAvailable) external {
//         require(_petId <= petCount, "Invalid pet ID");
//         pets[_petId].isAvailable = _isAvailable;
//     }
// }
