import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Background = () => {
  const navigate = useNavigate();
  const [showbutton, setshowbutton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setshowbutton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlenavigate = () => {
    navigate("/home");
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handlenavigate(); 
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="main-container bg-black h-screen w-screen relative">
        <div className="main bg-black h-screen justify-center flex items-center">
          <div className="text-bg h-4xl flex justify-center">
            <div className="text-performly text-white text-4xl">PERFORMLY</div>
          </div>
        </div>
        <div className="enter-button h-10 w-60 absolute top-4/8 left-3/7 flex justify-center items-center">
          <button
            className={`text-white hover:tracking-widest hover:text-blue-200 transition-all duration-700 ease-in-out ${
              showbutton ? "opacity-100 translate-y-5" : "opacity-0 translate-y-5"
            }`}
            onClick={handlenavigate}
          >
            [ GET STARTED ]
          </button>
        </div>
      </div>
    </>
  );
};

export default Background;
