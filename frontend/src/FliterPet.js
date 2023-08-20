import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import CardBox from "./Card";

import {
    FormControl,
    FormLabel,
    FormHelperText,
    SimpleGrid,
    Box,
    Radio,
    RadioGroup,
    HStack,
    Button,
    Input,
    Center,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
  } from "@chakra-ui/react";
  
import './Box.css'
function FliterPet() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [breed, setBreed] = useState("");
  const [isAvailable, setIsAvailable] = useState('0'); //O is false, 1 is true
  const [matchingPetIds, setMatchingPetIds] = useState([]);
  const [matchingPets, setMatchingPets] = useState([]);
  const [location, setLocation] = useState("")
  const handleFilterPets = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0];

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PetDatabaseContract.networks[networkId];
      const contract = new web3.eth.Contract(
        PetDatabaseContract.abi,
        deployedNetwork.address
      );

      // const imageKey = `pets/${name}-${Date.now()}.jpg`; // Define a unique key for each image
      // await s3
      //   .upload({
      //     Bucket: "petshopaps1050",
      //     Key: imageKey,
      //     Body: imageFile,
      //   })
      //   .promise();

      // const image = `https://petshopaps1050.s3.ca-central-1.amazonaws.com/${imageKey}`;

      // console.log(image); // Check if the result is available
      console.log(name, age, breed, isAvailable)
      const result = await contract.methods
        .filterPets(name, Number(age), breed, (isAvailable == '1' ? true : false), location)
        .call({ from: fromAddress });

      setMatchingPetIds(result);
      console.log(result)

      const pets = [];
      for (const petId of result) {
        const pet = await contract.methods.getPet(petId).call({ from: fromAddress });
        console.log(pet)

        pets.push(pet);
      }
      setMatchingPets(pets);
      console.log(matchingPets)

      console.log("Pets Filtered successfully"); // Log after successfully adding the pet
    } catch (error) {
      console.error("Error Filtering pet:", error);
    }
  };
  return (
    <>
    <div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
    <Heading>Filter Pets:</Heading>
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <FormControl padding="10px">
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Pet Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <FormLabel>Breed</FormLabel>
        <Input
          placeholder="Enter Breed"
          value={breed}
          onChange={(event) => setBreed(event.target.value)}
        />
        <FormLabel>Location</FormLabel>
        <Input placeholder="Enter Location" value={location} onChange={(event) => setLocation(event.target.value)}/>
        <FormLabel>Age</FormLabel>
        
        
        <NumberInput value={age} onChange={(valueString) => setAge(Number(valueString))} placeholder="Enter Age">
            <NumberInputField />
        </NumberInput>

        <FormLabel>Availabillity</FormLabel>
        <RadioGroup value={isAvailable} onChange={setIsAvailable}>
            <HStack spacing='24px'>
            <Radio value='1'>Is Available</Radio>
            <Radio value='0'>Adopted</Radio>
            </HStack>
        </RadioGroup>
        <Center h="75px" color="white">
          <Button colorScheme="blue" onClick={() => handleFilterPets()}>Filter</Button>
        </Center>
      </FormControl>

    </Box>
    </div>
    <Heading>Filtered Pets:</Heading>

    <div>
    <SimpleGrid spacing={3} templateColumns='repeat(auto-fill, minmax(400px, 1fr))'>
          {matchingPets.map((pet, index) => (
            <CardBox
            key={index}
            name={pet[0]}
            breed={pet[2]}
            age={Number(pet[1])}
            isAvailable={pet[3]}
            image={pet[4]}
            location={pet[5]}
            petIndex={index}
            voters={pet[6]}
            isVoted={pet[6] && pet[6].includes(localStorage.getItem("address"))}
            />
        ))}
    </SimpleGrid>
  </div>
  </>
    // <div>
    //   <h1>Filter Pets</h1>
    //   <input
    //     type="text"
    //     placeholder="Name"
    //     value={name}
    //     onChange={(event) => setName(event.target.value)}
    //   />
    //   <input
    //     type="number"
    //     placeholder="Age"
    //     value={age}
    //     onChange={(event) => setAge(event.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Breed"
    //     value={breed}
    //     onChange={(event) => setBreed(event.target.value)}
    //   />
    //   <label>
    //     Available:
    //     <input
    //       type="checkbox"
    //       checked={isAvailable}
    //       onChange={(event) => setIsAvailable(event.target.checked)}
    //     />
    //   </label>
    //   <button onClick={handleFilterPets}>Filter Pets</button>

    //   <h2>Matching Pets:</h2>
    //   <div className="grid-container">
    //     {matchingPets.map((pet, index) => (
    //     <CardBox
    //         key={index}
    //         name={pet[0]}
    //         breed={pet[2]}
    //         age={Number(pet[1])}
    //         image={pet[4]}
    //     />
    //     ))}
    //   </div>
    // </div>
  );
}

export default FliterPet;
