import Navbar from "../../NavBar/Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../../../Marketplace.json";
import { GetIpfsUrlFromPinata } from "../../../utils";

import axios from "axios";
import { useState } from "react";
import NFTTile from "../../NFTTile/NFTTile";
import "./Profile.css";
import Footer from "../../Footer/Footer";

export default function Profile() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");
  const [totalPrice, updateTotalPrice] = useState("0");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    let sumPrice = 0;
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
    let transaction = await contract.getMyNFTs();

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    const items = await Promise.all(
      transaction.map(async (i) => {
  
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        sumPrice += Number(price);
        return item;
      })
    );

    updateData(items);
    updateFetched(true);
    updateAddress(addr);
    updateTotalPrice(sumPrice.toPrecision(3));
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

  return (
    <div className="profileClass" style={{ minHeight: "100vh" }}>
      <Navbar></Navbar>
      <div className="profileTop">
        <h1 className="profileTop_Header">#PROFILE</h1>
        <p className="profileTop_para">Create NFTs, people cannot resist</p>
      </div>
      <div className="profileDetail">
        <div className="profileDetail_walletAddress">
          <h2 className="profileDetail_walletAddress_Header">
            My Wallet Address:
          </h2>
          <span className="profileDetail_walletAddress_address">
            {" "}
            {address}
          </span>
        </div>
        <div className="profileDetail_Below ">
          <div className="profileDetail_Below_content lf_margin">
            <h2 className="nft_number">No. of NFTs</h2>
            <p className="nft_number_amount"> {data.length}</p>
          </div>
          <div className="profileDetail_Below_content">
            <h2 className="nft_number">Total Value</h2>
            <div className="value">
              <p className="nft_number_amount">{totalPrice}</p>
              <span className="eth_span">ETH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profileClass">
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="Profile_NFT_Header">Your Collections</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <NFTTile data={value} key={index}></NFTTile>;
            })}
          </div>
          <div className="mt-10 text-xl error-text">
            {data.length == 0
              ? "Oops, No NFT data to display (Are you logged in?)"
              : ""}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
