import "./App.css";
import Marketplace from "./components/pages/Marketplace/Marketplace";
import Profile from "./components/pages/Profile/Profile";
import SellNFT from "./components/pages/SellNFT/SellNFT";
import NFTPage from "./components/pages/NFTPage/NFTPage";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/nftPage" element={<NFTPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sellNFT" element={<SellNFT />} />
      </Routes>
    </div>
  );
}

export default App;
