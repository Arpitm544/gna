import React from "react";
import LoaderText from "../animate/loader";
import Picture from "../animate/lottie";
import { useNavigate } from "react-router-dom";
import Cardsele from "../card/uf"
import Footer from "../footer/footer"

const Home = () => {
  const navigateto = useNavigate();
  const handlenavigate = () => {
    navigateto("/signin");
  };

  let stackArea = document.querySelector(".third-page");

  window.addEventListener("scroll", ()=>{
    let distance = window.innerHeight/2;
    let topval = stackArea.getBoundingClientRect().top;
    let index = -1 * (topval/distance +1);
    index,Math.floor
  });

  const images = [
    { src: "bands.webp", name: "Bands" },
    { src: "comedian.jpg", name: "Comedians" },
    { src: "dancer.jpg", name: "Dancers" },
    { src: "DJS.webp", name: "DJs" },
    { src: "magician.jpg", name: "Magicians" },
    { src: "musician.webp", name: "Musicians" },
  ];
  const secondSlideText = [
    " BANDS ",
    " COMEDIANS ",
    " DANCERS ",
    " DJS ",
    " MAGICIAN ",
    "MUSICIANS",
    "RAPPERS",
    "ENTERTAINERS",
    "LYRICISTS",
    "VOCALISTS",
    "PAINTERS",
    "ACTORS",
  ];

  return (
    <div className="main h-full">
     <div>
  <header className="head fixed top-0 z-[1] h-20 w-screen flex items-center justify-between ">

    <div className="logo flex items-center">
      <img src="./logoo.png" alt="Logo" className="h-26 mt-10 " />
    </div>

    {/* Login button on the right */}
    <div className="flex pr-5 items-center">
      <button
        className="h-12 w-28  rounded-lg bg-sky-900 text-lg text-white hover:scale-110 transition-all duration-300 ease-in-out hover:bg-black hover:text-white"
        onClick={handlenavigate}
      >
        LOGIN
      </button>
    </div>
  </header>
</div>

      <div className="home-container overflow-hidden h-full w-screen relative bg-black">
        <div className="service-text flex flex-col lg:flex-row h-screen w-full bg-orange-100">
          <div className="w-full lg:w-2/5 h-full text-4xl  sm:text-6xl lg:text-8xl p-3">
            <div className="text-pos h-1/5 w-full flex relative">
              <h1 className="absolute top-2/4 font-bold left-[5%]  hover:border-b-3  transition-all ease-in 200">
                FIND YOUR PERFORMER
              </h1>
            </div>
            <div className="textaniamte flex h-2/5 w-full ">
              <LoaderText />
            </div>
            <div className="third h-2/5 w-full ">
              <h1 className="border-l-30 border-orange-100 text-sky-900 text-5xl">
                Your Gateway to Incredible Gigs and Unforgettable Events!
              </h1>

            </div>
          </div>
          <div className="second h-screen w-3/5 ">
            <div className="slider w-1/3 h-full  ">
              <div className=" w-full relative h-full">
                <div className="animate-slide absolute left-90 ">
                  {[...images, ...images].map((item, i) => (
                    <div
                      key={i}
                      className="w-60 sm:w-56 md:w-64 h-50 mx-2 flex-shrink-0 ease-in-out duration-200 hover:scale-105"
                    >
                      <img
                        src={item.src}
                        className="h-49 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="slider2 w-2/3 h-full opacity-90 ">
              <div className=" w-full relative h-full">
                <div className="animate-slide2 absolute left-160">
                  {[...images, ...images, ...images].map((item, i) => (
                    <div
                      key={i}
                      className="w-60 sm:w-56 md:w-64 h-50 mx-2 flex-shrink-0 ease-in-out duration-200 hover:scale-105"
                    >
                      <img
                        src={item.src}
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}

      
      <div className="second-page h-screen  w-screen">
        <div className="one h-1/7 bg-black text-white flex items-center overflow-hidden py-6">
          <div className="secondslide-text space-x-50 font-bold text-3xl whitespace-nowrap items-center">
            {[...secondSlideText, ...secondSlideText, ...secondSlideText].map(
              (text, index) => (
                <span key={index}> || {text}||</span>
              )
            )}
          </div>
        </div>
        <div className="two h-3/7 relative ">
          <div className="aboutus h-1/2 text-9xl  w-[50%] font-bold absolute top-10 left-10 ">
            <h1 className=" appearanimation">What We Do</h1>
          </div>
          <div className="secondtext h-1/4 text-5xl flex items-center font-bold  w-[80%] absolute top-40 left-13">
            <h1>
              Connecting artists and organizers effortlessly to spotlight and
              discover talent.
            </h1>
          </div>
        </div>
        <div className="three h-3/7  relative">
          <div className="aboutustext h-[90%] w-[95%] flex absolute left-15   ">
            <div className="  w-full "></div>
            <div className="appearanimation2 w-full text-orange-200 bg-sky-900  text-xl hover:scale-110 transition-all ease-in-out duration-500 border-29 border-sky-900 rounded-xl">
              <h1 className="text-5xl">Performers</h1>
              
              We empower performers with a platform to showcase their talent, manage gigs effortlessly, and secure fast, hassle-free payments. Build a captivating brand, grow your reputation with verified reviews, and stay connected with a supportive community. Let us help you elevate your career and unlock new opportunities.
            </div>
            <div className="w-1/7"></div>
            <div className="appearanimation text-orange-200 h-full w-full text-xl bg-sky-900 hover:scale-110 transition-all ease-in-out duration-500  border-29 border-sky-900  rounded-xl ">
              <h1 className="text-5xl text-orange-200">Clients & Event Organizers:</h1>
              
              Clients and event organizers can discover exceptional local talent, from musicians and magicians to comedians and dancers. Effortlessly browse and filter by category, price, availability, and location.
              
            </div>
          </div>
        </div>
      </div>
      <div className="third-page h- w-full">
                 <Cardsele/>
       
</div>

<div className="w-full ">
  <Footer/>
</div>
      
    </div>
  );
};

export default Home;
