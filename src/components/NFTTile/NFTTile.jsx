import { BrowserRouter as Router, Link } from "react-router-dom";
import "./NFTTile.css";
import { GetIpfsUrlFromPinata } from "../../utils";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };
  const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);

  return (
    <Link to={newTo}>
      <div className="nft_container">
        <div className="div_image">
        <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-lg object-cover" crossOrigin="anonymous" />
          <div className="image_overlay">
            <p className="image_description">Click to see the description</p>
          </div>
        </div>
        <div className="nft_container_bottom">
          <div className="nft_container_bottom_left">
            <span className="nft_container_bottom__header">
              {data.data.name}
            </span>
            <span className="nft_container_bottom__number">
              #{data.data.name.split("#")[1]}
            </span>
          </div>
          <div className="nft_container_bottom_right">
            <span className="eth_price">{data.data.price}</span>
            <img
              src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png"
              className="eth_image"
              alt=""
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
