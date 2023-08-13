import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import Card from "./Card";

import './Box.css'
function FliterPet() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [breed, setBreed] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [matchingPetIds, setMatchingPetIds] = useState([]);
  const [matchingPets, setMatchingPets] = useState([]);

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
      const result = await contract.methods
        .filterPets(name, age, breed, isAvailable)
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
    <div>
      <h1>Filter Pets</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />
      <input
        type="text"
        placeholder="Breed"
        value={breed}
        onChange={(event) => setBreed(event.target.value)}
      />
      <label>
        Available:
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => setIsAvailable(event.target.checked)}
        />
      </label>
      <button onClick={handleFilterPets}>Filter Pets</button>

      <h2>Matching Pets:</h2>
      <div className="grid-container">
        {matchingPets.map((pet, index) => (
        <Card
            key={index}
            name={pet[0]}
            breed={pet[2]}
            age={Number(pet[1])}
            image={pet[4]}
        />
        ))}
      </div>
    </div>
  );
}

export default FliterPet;
