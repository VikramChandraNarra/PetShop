import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AdoptionContract from "./Adoption.json";
import PetDatabaseContract from "./PetDatabase.json";

import CardBox from "./Card";
import { SimpleGrid, Text, Heading } from '@chakra-ui/react'

import "./Box.css";

function OwnerAnalytics() {
  const web3 = new Web3(window.ethereum);

  const [usersArray, setUsersArray] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {

        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AdoptionContract.networks[networkId];
        const contract = new web3.eth.Contract(
            AdoptionContract.abi,
          deployedNetwork.address
        );

        const deployedNetwork2 = PetDatabaseContract.networks[networkId];
        const contract2 = new web3.eth.Contract(
            PetDatabaseContract.abi,
          deployedNetwork2.address
        );

        // Fetch updated pets
        const adoptersArray = await contract.methods.getAdopters().call({ from: fromAddress });
        const adoptedPetsByOwner = {};

        for (let petId = 0; petId < adoptersArray.length; petId++) {
          const adopterAddress = adoptersArray[petId];
          if (adopterAddress !== "0x0000000000000000000000000000000000000000") {
            if (!adoptedPetsByOwner[adopterAddress]) {
              adoptedPetsByOwner[adopterAddress] = [];
            }
            adoptedPetsByOwner[adopterAddress].push(await contract2.methods.getPet(petId).call({ from: fromAddress }));
          }
        }
        console.log(adoptedPetsByOwner)

        // for (let i = 0; i < result.length; i++) {
        //     const temp = await contract.methods.getPet(result[i]).call({ from: fromAddress });
        //     randomArr.push(temp);
        // }
    
        setUsersArray(adoptedPetsByOwner);

      } catch (error) {
        console.error("Error loading pets:", error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 1 second
    // const intervalId = setInterval(fetchData, 10000);

    // Clean up the interval when the component is unmounted
    // return () => clearInterval(intervalId);
  }, []);


  return (
    <div>
      <Text fontSize="4xl" as="b" margin="20px">
        Adopted Pets Database:
      </Text>
        {Object.entries(usersArray).map(([address, pets], index) => (
          <div key={index}>
            <Heading  margin="20px" as='h3' size='lg'>{address}:</Heading>
            <SimpleGrid spacing={3} templateColumns='repeat(auto-fill, minmax(400px, 1fr))' margin='20px'>
            {pets.map((pet, petIndex) => (
                
              <CardBox
                key={petIndex}
                name={pet[0]}
                breed={pet[2]}
                age={Number(pet[1])}
                isAvailable={pet[3]}
                image={pet[4]}
                location={pet[5]}
                petIndex={petIndex}
                voters={pet[6]}
                isVoted={pet[6] && pet[6].includes(localStorage.getItem("address"))}
                price={web3.utils.fromWei(pet[7], "ether")}
              />
            ))}
            </SimpleGrid>
          </div>
        ))}
    </div>
  );
}

export default OwnerAnalytics;
