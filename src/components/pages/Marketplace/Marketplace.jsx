import Navbar from "../../NavBar/Navbar";
import NFTTile from "../../NFTTile/NFTTile";
import MarketplaceJSON from "../../../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import Footer from "../../Footer/Footer";
import "./Marketplace.css";
import { GetIpfsUrlFromPinata } from "../../../utils";

export default function Marketplace() {
  const sampleData = [
    {
      name: "NFT#1",
      description: "Suvisa First NFT",
      image:
        "https://static01.nyt.com/images/2021/03/12/arts/11nft-auction-cryptopunks-print/11nft-auction-cryptopunks-print-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
      price: "0.03",
      address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13", // a dummy wallet address
    },
    {
      name: "NFT#2",
      description: "Suvisa Second NFT",
      image:
        "https://www.cnet.com/a/img/resize/5a9287797e44d98efa098c9c22ad9857a7cfb9e4/2021/11/29/f566750f-79b6-4be9-9c32-8402f58ba0ef/richerd.png?auto=webp&width=1200",
      price: "0.03",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#3",
      description: "Suvisa Third NFT",
      image:
        "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/7GBCHQUCEROJDPEVYQW7XG7VAE.jpg",
      price: "0.03",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
  ];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
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
    //create an NFT Token
    let transaction = await contract.getAllNFTs();

    //Fetch all the details of every NFT from the contract and display
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
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10">
        <div className="Marketplace_top">
          <div className="header">
            NFT <span className="header_span">Market</span>Place
          </div>
          <p className="header_description">Buy the NFTs that excites you.</p>
        </div>
        <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
/*
cd Suvisa
git add .
git commit -m "connected NFT page with blockchain :zap:"
git push

baki: sellnft
*/
