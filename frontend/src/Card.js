import React, { useEffect, useState } from "react";
import "./Box.css";
import { Box, Typography, Button} from "@mui/material";
import Web3 from "web3";
import PetDatabaseContract from "./PetDatabase.json";
import AdoptionContract from "./Adoption.json"


function Card({ name, age, breed, image, petIndex, isAvailable}) {

  const [isAdoppted, setIsAdopted] = useState(!isAvailable)

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleClickAdopt = async () => {
    try {

      console.log("petIndex:", petIndex)
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



      if (isAdoppted == false) {
        await contract.methods
        .updatePetAvailability(petIndex, false)
        .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit



        setIsAdopted(true)

        

      } else {
        await contract.methods
        .updatePetAvailability(petIndex, true)
        .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit


        setIsAdopted(false)
      }

      


      console.log("Pet Adopted by " + fromAddress + " successfully"); // Log after successfully adding the pet
      
      // const contract2 = new web3.eth.Contract(
      //   AdoptionContract.abi,
      //   deployedNetwork.address
      // );
      // await contract2.methods
      //   .adopt(petIndex)
      //   .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit
      
    } catch (error) {
      console.error("Error Adopting pet:", error);
    }
  }

  const handleClickVote = async () => {
    // try {
    //   const web3 = new Web3(window.ethereum);
    //   await window.ethereum.request({ method: "eth_requestAccounts" });

    //   const accounts = await web3.eth.getAccounts();
    //   const fromAddress = accounts[0];

    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork = PetDatabaseContract.networks[networkId];
    //   const contract = new web3.eth.Contract(
    //     AdoptionContract.abi,
    //     deployedNetwork.address
    //   );
    //   const result = await contract.methods
    //     .adopt(key)
    //     .send({ from: fromAddress, gas: 4000000 }); // Increase the gas limit

    //   console.log(result);

    //   console.log("Pet voted by" + fromAddress + " successfully"); // Log after successfully adding the pet
    // } catch (error) {
    //   console.error("Error voting for pet:", error);
    // }
  }
  return (
    <Box
      sx={{
        padding: 3,
        border: "1px solid rgba(224, 224, 224, 0)",
        borderRadius: 4,
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow:
            "0px 4px 12px rgba(0, 0, 0, 0.2), 0px 0px 20px 5px rgba(219, 203, 178, 0.5)",
        },
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        backgroundColor: "#2B2B2B",
        margin: "10px",
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={isValidUrl(image) ? image : "data:image/png;base64,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"}
          style={{
            width: "100%",
            height: "50%", // Adjusted height to match the top half of the box
            objectFit: "cover",
          }}
        />
        
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Added flex-wrap property
          padding: "10px 5px 5px 5px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "5px", // Adjusted gap value
          alignSelf: "stretch",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "30px",
            fontFamily: "Work Sans, sans-serif",
            lineHeight: "140%",
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="Company"
          color="textSecondary"
          sx={{
            fontFamily: "Work Sans, sans-serif",
            color: "white",
            fontSize: "20px",
          }}
        >
          {breed}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            fontFamily: "Work Sans, sans-serif",
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          <span style={{ color: "#7A5FEC", fontSize: "11px" }}>Age</span>
          <br /> {age} {/* Added line break */}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            fontFamily: "Work Sans, sans-serif",
            color: "white",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          <span style={{ color: "#7A5FEC", fontSize: "11px" }}>Location</span>
          <br /> Toronto {/* Added line break */}
        </Typography>

                {/* Vote Button */}
                <Button
          variant="outlined"
          color="primary"
          sx={{ marginTop: "10px" }}
          onClick={() => handleClickVote()}

        >
          Vote
        </Button>

        {/* Adopt Button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: "5px" }}
          onClick={() => handleClickAdopt()}
        >
          {isAdoppted == false ? "Adopt" : "Return" }
        </Button>
      </div>
    </Box>
  );
}

export default Card;
