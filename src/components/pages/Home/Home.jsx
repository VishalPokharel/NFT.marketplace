import React from "react";
import Navbar from "../../NavBar/Navbar";
import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="Home">
      <Navbar></Navbar>
      <div className="Home_body">
        <div className="blur"></div>

        <div className="Home_body_main">
          <div className="Home_body_left">
            <div className="Home_body_left_content">
              <h2 className="Home_body_left_header">
                Create, collect, and sell extraordinary NFTs
              </h2>
              <p className="Home_body_left_para">
                A community governed decentralized Marketplace
              </p>
              <div className="Home_body_left_buttons">
                <div className="Home_body_left_button ">
                  <Link to="/marketPlace">
                    <button>Explore</button>
                  </Link>
                </div>
                <div className="Home_body_left_button">
                  <Link to="/sellNFT">
                    <button>Create</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="Home_body_right">
            <div className="Home_body_right_image">
              <img
                src="https://news.artnet.com/app/news-upload/2022/05/MURAK_2022.0146_CRP-1024x1024.jpg"
                alt=""
                className="Home_image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
