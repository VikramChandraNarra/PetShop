import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import Card from "./Card";


import './Box.css'


function ViewPets() {
  const [matchingPets, setMatchingPets] = useState([]);

  const render = async () => {
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
        .getAllPets()
        .call({ from: fromAddress });

      setMatchingPets(result);
      console.log(result);

      console.log("Pets Filtered successfully"); // Log after successfully adding the pet
    } catch (error) {
      console.error("Error Filtering pet:", error);
    }
  };

  useEffect(() => {
    render();
  }, []);
  return (
    <div>
      <h2>View Pets:</h2>
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

export default ViewPets;
