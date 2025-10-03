import React, { useEffect } from "react";
import bgImage from "../assets/images/L2.jpg"; // your image path
import '../styles/HomePage.css';


const HomePage = () => {
  useEffect(() => {
    // Set the background on body
    document.body.style.backgroundImage = `url(${bgImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.margin = 0;
    document.body.style.height = "100vh";
    document.body.style.width = "100%";
    document.body.style.color = "#fff";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.margin = "";
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <>

    </>
  );
};

export default HomePage;
