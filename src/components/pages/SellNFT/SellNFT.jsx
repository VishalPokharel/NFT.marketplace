import Navbar from "../../NavBar/Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../../pinata";
import Marketplace from "../../../Marketplace.json";
import { useLocation } from "react-router";
import "./SellNFT.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Footer from "../../Footer/Footer";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");
  const location = useLocation();

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to IPDS
  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileURL) return;

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  const clearMessage = () => {
    updateMessage("");
  };

  async function listNFT(e) {
    setTimeout(clearMessage, 3000);

    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      updateMessage("Please wait.. (uploading in 3 mins)");

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //massage the params to be sent to the create NFT request
      const price = ethers.utils.parseUnits(formParams.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully listed your NFT!");
      updateMessage("");
      updateFormParams({ name: "", description: "", price: "" });
      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  console.log("Working", process.env);
  return (
    <div className="SellNFT">
      <Navbar></Navbar>
      <div className="SellNFT_Top">
        <h1 className="SellNFT_Top_Header">#AddYourNFT</h1>
      </div>
      <div className="SellNFT_Form" id="nftForm">
        <form className="">
          <h3 className="SellNFT_Form_Header">
            Upload your NFT to the marketplace
          </h3>
          <div className="SellNFT_Form_Item">
            <label className="SellNFT_Form_Item_Label" htmlFor="name">
              Name
            </label>
            <input
              className="SellNFT_Form_Item_Input"
              id="name"
              type="text"
              placeholder="Enter name"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="SellNFT_Form_Item">
            <label className="SellNFT_Form_Item_Label" htmlFor="description">
              NFT Description
            </label>
            <textarea
              className="SellNFT_Form_Item_Textarea"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Enter description"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="SellNFT_Form_Item">
            <label className="SellNFT_Form_Item_Label" htmlFor="price">
              Price (in ETH)
            </label>
            <input
              className="SellNFT_Form_Item_Input"
              type="number"
              placeholder="Enter price"
              step="0.01"
              value={formParams.price}
              onChange={(e) =>
                updateFormParams({ ...formParams, price: e.target.value })
              }
            ></input>
          </div>
          <div className="SellNFT_Form_Item_Last">
            <label className="SellNFT_Form_Item_Label label_margin_Right">
              Upload Image
            </label>
            <label className="Label_Chose_Image" htmlFor="image">
              <AddPhotoAlternateIcon className="Label_Chose_Image_Icon" />
            </label>
            <input
              hidden
              id="image"
              type="file"
              onChange={OnChangeFile}
            ></input>
          </div>

          <div className="text-green text-center">{message}</div>
          <button onClick={listNFT} className="SellNFT_Button">
            List NFT
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
