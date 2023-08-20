import React, { useState, useEffect } from "react";
import Web3 from "web3";


import PetDatabaseContract from "./PetDatabase.json";
import AWS from "aws-sdk";
import {ethers} from 'ethers';
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

function Donate() {

    const [amount, setAmount] = useState('0')

    const handleDonation = async () => {
        console.log("Donating:", amount); // Log before adding the pet
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
          const amountInWei = web3.utils.toWei(amount, "ether");


          await contract.methods.donate(
            localStorage.getItem("owner")
          ).send({ from: fromAddress, value: amountInWei });    
          console.log("Donated succesfully"); // Log after successfully adding the pet
        } catch (error) {
          console.error("Error doating:", error);
        }
      };




  return (
<div style={{ display: "grid", placeItems: "center", height: "60vh" }}>
    <Heading>Filter Pets:</Heading>
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <FormControl padding="10px">

        <FormLabel>Ether</FormLabel>
        
        
        <NumberInput value={amount} onChange={(valueString) => setAmount(valueString)} placeholder="Enter how much eth you want to donate">
            <NumberInputField />
        </NumberInput>

        <Center h="75px" color="white">
          <Button colorScheme="blue" onClick={() => handleDonation()} >Donate</Button>
        </Center>
      </FormControl>

    </Box>
    </div>
  );
}

export default Donate;
