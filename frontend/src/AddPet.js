import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import AWS from "aws-sdk";

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
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

AWS.config.update({
  accessKeyId: "AKIATSLR2DFC2M6VS2OE",
  secretAccessKey: "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",
  region: "ca-central-1",
});

const s3 = new AWS.S3();

function AddPet() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [breed, setBreed] = useState("");
  const [location, setLocation] = useState("");
  const [fee, setFee] = useState("")

  // const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleAddPet = async () => {
    console.log("Adding pet:", name, age, breed, location, fee); // Log before adding the pet
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

      const imageKey = `pets/${name}-${Date.now()}.jpg`; // Define a unique key for each image
      await s3
        .upload({
          Bucket: "petshopaps1050",
          Key: imageKey,
          Body: imageFile,
        })
        .promise();

      const image = `https://petshopaps1050.s3.ca-central-1.amazonaws.com/${imageKey}`;
      const adoptionFee = web3.utils.toWei(fee, "ether"); // Convert to Wei

      console.log(image); // Check if the result is available
      await contract.methods
        .addPet(name, age, breed, image, location, adoptionFee)
        .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit

      console.log("Pet added successfully"); // Log after successfully adding the pet
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  // Enable Ethereum account on component mount

  return (
    <div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
      <Heading>Add a pet</Heading>
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
          <Input placeholder="Enter Location"  value={location} onChange={(event) => setLocation(event.target.value)}/>
          <FormLabel>Age</FormLabel>
          <NumberInput
            max={50}
            min={0}
            marginBottom="10px"
            value={age}
            onChange={(valueString) => setAge(valueString)}
            >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel>Adoption Fee (ETH)</FormLabel>
          <NumberInput
            max={50}
            min={0}
            marginBottom="10px"
            value={fee}
            onChange={(valueString) => setFee(valueString)}
            >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files[0])}
          />
          <Center h="75px" color="white">
            <Button colorScheme="blue" onClick={() => handleAddPet()}>Add Pet</Button>
          </Center>
        </FormControl>
      </Box>
    </div>
  );
}

export default AddPet;
