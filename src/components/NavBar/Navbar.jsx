import "./Navbar.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const [showConnected, setShowConnected] = useState(connected);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  const showHandler = () => {
    setShowConnected((prev) => !prev);
  };

  return (
    <div className="Topbar">
      <nav className="navbar">
        <div className="navbar_left">
          <Link to="/">
            {/* <img src={fullLogo} alt="" width={120} height={120} className="" /> */}
            <p className="logo">Our</p>
          </Link>
          <Link to="/marketPlace">
            <div className="navbar_left_nft">NFT Marketplace</div>
          </Link>
        </div>
        <div className="navbar_right">
          <div className="navbar_right_content">
            <Link to="/marketPlace">
              <p
                className={location.pathname === "/marketPlace" ? "active" : ""}
              >
                Marketplace
              </p>
            </Link>
          </div>
          <div className="navbar_right_content">
            <Link to="/sellNFT">
              <p className={location.pathname === "/sellNFT" ? "active" : ""}>
                List My NFT
              </p>
            </Link>
          </div>
          <div className="navbar_right_content">
            <Link to="/profile">
              <p className={location.pathname === "/profile" ? "active" : ""}>
                Profile
              </p>
            </Link>
          </div>
          <div className="">
            <button
              className="navbar_right_button enableEthereumButton"
              onClick={connectWebsite}
            >
              {connected ? "Connected" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>
      {location.pathname !== "/" &&
        location.pathname !== "/profile" &&
        location.pathname !== "/sellNFT" &&
        showConnected && (
          <div className="navbar_connection_text">
            {currAddress !== "0x"
              ? "Connected to"
              : "Not Connected. Please login to view NFTs"}{" "}
            {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
            <CloseIcon className="closeIcon" onClick={showHandler} />
          </div>
        )}
    </div>
  );
}

export default Navbar;
