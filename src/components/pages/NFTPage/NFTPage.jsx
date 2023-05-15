import Navbar from "../../NavBar/Navbar";
import { useParams } from "react-router-dom";
import MarketplaceJSON from "../../../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import "./NFTPage.css";
import CloseIcon from "@mui/icons-material/Close";
import Footer from "../../Footer/Footer";
import { GetIpfsUrlFromPinata } from "../../../utils";

export default function NFTPage(props) {
  const [data, updateData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token

    var tokenURI = await contract.tokenURI(tokenId);
    console.log("getting this tokenUri", tokenURI);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);

    
   const listedToken = await contract.getListedTokenForId(tokenId);

 

    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
  }

  async function buyNFT(tokenId) {
    try {
      setShowMessage(true);
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

  const closeMessage = () => {
    setShowMessage((prev) => !prev);
  };

  return (
    <div style={{ "min-height": "100vh" }} className="NFTPage_Main">
      <Navbar></Navbar>
      {/* {message} */}
      {showMessage && (
        <div className="message">
          Buying the NFT please wait
          <CloseIcon className="closeIcon" onClick={closeMessage} />
        </div>
      )}

      <div className="NFTPageDiv">
        <div className="NFTPageDiv_left">
          <img src={data.image} alt="" className="NFTPageDiv_left_Image" />
        </div>
        <div className="NFTPageDiv_right">
          <div className="NFTPageDiv_right_content">
            <h1 className="NFTPageDiv_right_content_Header">{data.name}</h1>
            <p className="NFTPageDiv_right_content_Para">
              The perfect Nfts Nft Bored Ape Animated GIF for your conversation.
              Discover and Share the best GIFs on Tenor.
            </p>
            <div className="NFTPageDiv_right_content_Price">
              <div>Price:</div>
              <div className="NFTPageDiv_right_content_Price_div">
                <span className="price_span">{data.price}</span>
                <img
                  src="https://avatars.githubusercontent.com/u/38262884?v=4"
                  className="eth_symbol"
                  alt=""
                />
              </div>
            </div>
            <div className="NFTPageDiv_right_content_Trade">
              <div className="NFTPageDiv_right_content_Trade_buyer">
                <h2>Owner's Wallet Address</h2>
                <p className="owner">{data.owner}</p>
              </div>
              <div className="NFTPageDiv_right_content_Trade_seller">
                <h2>Seller's Wallet Address</h2>
                <p className="seller">{data.seller}</p>
              </div>
            </div>

            <div className="NFTpage_Detail_bottom">
              {currAddress == data.owner || currAddress == data.seller ? (
                <div className="own_info">You are the owner of this NFT</div>
              ) : (
                <button
                  className="enableEthereumButton NFTpage_Detail_bottom_button btn btn--color"
                  onClick={() => buyNFT(tokenId)}
                >
                  Buy this NFT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
