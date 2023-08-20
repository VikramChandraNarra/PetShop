import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import CardBox from "./Card";
import { SimpleGrid, Text } from '@chakra-ui/react'

import "./Box.css";

function Analytics() {
  const web3 = new Web3(window.ethereum);

  const [matchingPets, setMatchingPets] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch updated pets
        const result = await contract.methods.getPetsAdopted().call({ from: fromAddress });
        console.log(result);
        const randomArr = [];

        for (let i = 0; i < result.length; i++) {
            const temp = await contract.methods.getPet(result[i]).call({ from: fromAddress });
            randomArr.push(temp);
        }

        setMatchingPets(randomArr);

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
    <Text fontSize='4xl' as='b' margin='20px' >Adopted Pets:</Text>
    <SimpleGrid spacing={3} templateColumns='repeat(auto-fill, minmax(400px, 1fr))' margin='20px'>
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
            price={web3.utils.fromWei(pet[7], "ether")}
            />
        ))}
    </SimpleGrid>
    </div>
  );
}

export default Analytics;
