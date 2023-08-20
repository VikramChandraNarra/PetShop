//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Adoption.sol";

contract PetDatabase {
    struct Pet {
        string name;
        uint8 age;
        string breed;
        bool isAvailable;
        string image; 
        string location;
        address[] voters;
        uint256 adoptionFee;
    }

    Pet[] public pets;
    uint petCount = 0;
    Adoption public adoptionInstance;

    constructor(address _adoptionInstance) {
        adoptionInstance = Adoption(_adoptionInstance);
    }


    event PetAdded(
        uint256 indexed petId,
        string name,
        uint8 age,
        string breed,
        bool isAvailable,
        string image, // Updated event to include image
        string location
    );

    function addPet(
        string memory _name,
        uint8 _age,
        string memory _breed,
        string memory _image, 
        string memory _location,
        uint256 _adoptionFee
    ) external {
        pets.push(
            Pet(
                _name,
                _age,
                _breed,
                true,
                _image,
                _location,
                new address[](0),
                _adoptionFee
            )
        ); 
        petCount = petCount + 1;

        emit PetAdded(petCount, _name, _age, _breed, true, _image, _location);
    }

    function getPet(
        uint256 _petId
    )
        external
        view
        returns (
            string memory,
            uint8,
            string memory,
            bool,
            string memory,
            string memory,
            address[] memory,
            uint256
        )
    {
        require(_petId < pets.length, "Invalid pet ID"); 

        Pet memory pet = pets[_petId];
        return (
            pet.name,
            pet.age,
            pet.breed,
            pet.isAvailable,
            pet.image,
            pet.location,
            pet.voters,
            pet.adoptionFee
        );
    }

    function getAllPets() external view returns (Pet[] memory) {
        return pets;
    }

    function addVoter(uint256 _petId) external {
        require(_petId < pets.length, "Invalid pet ID");
        pets[_petId].voters.push(msg.sender);
    }

    function removeVoter(uint256 _petId) external {
        require(_petId < pets.length, "Invalid pet ID");
        address[] storage voters = pets[_petId].voters;
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == msg.sender) {
                voters[i] = voters[voters.length - 1];
                voters.pop();
                break;
            }
        }
    }

    function hasVoted(uint256 _petId) external view returns (bool) {
        require(_petId < pets.length, "Invalid pet ID");
        address sender = msg.sender;
        address[] storage voters = pets[_petId].voters;

        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == sender) {
                return true;
            }
        }

        return false;
    }

    function adoptPet(uint256 _petId, address payable _ownerAddress) external payable{
        require(_petId < pets.length, "Invalid pet ID"); // Validate pet ID
        require(pets[_petId].isAvailable, "Pet is not available for adoption");

        uint256 adoptionFee = pets[_petId].adoptionFee;
        require(msg.sender.balance >= adoptionFee, "Insufficient balance");


        _ownerAddress.transfer(adoptionFee);

        pets[_petId].isAvailable = false;

        adoptionInstance.adopt(_petId, msg.sender);

    }

    function getPetsAdopted() external view returns (uint256[] memory) {
        uint256[] memory adoptedPetIds = new uint256[](pets.length);
        uint256 adoptedCount = 0;

        for (uint256 i = 0; i < pets.length; i++) {
            if (adoptionInstance.getAdopter(i) == msg.sender) {
                adoptedPetIds[adoptedCount] = i;
                adoptedCount++;
            }
        }

        uint256[] memory result = new uint256[](adoptedCount);
        for (uint256 j = 0; j < adoptedCount; j++) {
            result[j] = adoptedPetIds[j];
        }

        return result;
    }

    function filterPets(
        string memory _name,
        uint8 _age,
        string memory _breed,
        bool _isAvailable,
        string memory _location
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
            bool locationMatches = bytes(_location).length == 0 ||
                keccak256(bytes(pets[i].location)) ==
                keccak256(bytes(_location));
            if (
                nameMatches &&
                ageMatches &&
                breedMatches &&
                availabilityMatches &&
                locationMatches
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

    function donate(address payable donationAddress) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        donationAddress.transfer(msg.value);
    }
}
