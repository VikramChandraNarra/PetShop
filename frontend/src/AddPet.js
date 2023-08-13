import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import AWS from "aws-sdk";

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
  // const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleAddPet = async () => {
    console.log("Adding pet:", name, age, breed); // Log before adding the pet
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });

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

      console.log(image); // Check if the result is available
      await contract.methods
        .addPet(name, age, breed, image)
        .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit

      console.log("Pet added successfully"); // Log after successfully adding the pet
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  // Enable Ethereum account on component mount


  return (
    <div>
      <h1>Add a New Pet</h1>
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
      <input
        type="file"
        accept="image/*"
        onChange={(event) => setImageFile(event.target.files[0])}
      />
      <button onClick={handleAddPet}>Add Pet</button>
    </div>
  );
}

export default AddPet;

