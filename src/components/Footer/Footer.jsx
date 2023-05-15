import React from "react";
import "./Footer.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer_Top">
        <div className="Footer_Top_items">
          <div className="Footer_Top_items_item">
            <GitHubIcon className="Footer_Icon" />
          </div>
          <div className="Footer_Top_items_item">
            <FacebookIcon className="Footer_Icon" />
          </div>
          <div className="Footer_Top_items_item">
            <LinkedInIcon className="Footer_Icon" />
          </div>
          <div className="Footer_Top_items_item">
            <EmailIcon className="Footer_Icon" />
          </div>
        </div>
        <div className="Footer_Bottom">
          <span>Copyright &copy; 2022, All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
