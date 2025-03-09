"use client";

import React, { useEffect, useState } from "react";

const SetmoreBooking = ({ content, className, onClick, link }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Function to load the Setmore script
    const loadSetmoreScript = () => {
      if (document.getElementById("setmore_script")) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://storage.googleapis.com/fullintegration-live/webComponentAppListing/Container/setmoreIframeLive.js";
      script.id = "setmore_script";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };

    // Load the script
    loadSetmoreScript();

    // Cleanup function
    return () => {
      const script = document.getElementById("setmore_script");
      if (script) {
        document.body.removeChild(script);
        setScriptLoaded(false)
      }
    };
  }, []);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div id="setmore-booking-container">
      {scriptLoaded ? (
        <a
          className={className}
          id="Setmore_button_iframe"
          href={link || "https://nihongowithmoeno.setmore.com"}
          onClick={handleClick}
          style={{ float: "none", cursor: "pointer" }}
        >
          {content}
        </a>
      ) : (
        <a
          className={className}
          id="Setmore_button_iframe"
          href="https://nihongowithmoeno.setmore.com"
          // onClick={handleClick}
          style={{ float: "none", cursor: "pointer" }}
        >
          {content}
        </a>
      )}
    </div>
  );
};

export default SetmoreBooking;
