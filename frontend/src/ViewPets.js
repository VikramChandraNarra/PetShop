import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import Card from "./Card";

import "./Box.css";

function ViewPets() {
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
        contract.events.PetAdded({ fromBlock: 0 }, async (error, event) => { 
            const result = await contract.methods.getAllPets().call({ from: fromAddress });
            setMatchingPets(result);
        });
        // Fetch updated pets
        const result = await contract.methods.getAllPets().call({ from: fromAddress });
        setMatchingPets(result);
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
      <h2>View Pets:</h2>
      <div className="grid-container">
        {matchingPets.map((pet, index) => (
          <Card
            key={index}
            name={pet[0]}
            breed={pet[2]}
            age={Number(pet[1])}
            isAvailable={pet[3]}
            image={pet[4]}
            petIndex={index}
          />
        ))}
      </div>
    </div>
  );
}

export default ViewPets;
