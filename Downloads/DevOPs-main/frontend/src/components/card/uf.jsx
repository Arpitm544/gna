import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const uf = () => {

  const navigateto = useNavigate();
  const handlenavigate = () => {
    navigateto("/signin");
  };
  const rotateCards = () => {
    const cards = document.querySelectorAll(".cards");
    let angle = 0;
    cards.forEach((card, index) => {
      if (card.classList.contains("away")) {
        card.style.transform = `translateY(-120vh) rotate(-48deg)`;
      } else {
        card.style.transform = `rotate(${angle}deg)`;
        angle -= 10;
        card.style.zIndex = cards.length - index;
      }
    });
  };

  useEffect(() => {
    rotateCards();
  }, []);

  useEffect(() => {
    const stackArea = document.querySelector(".stackarea");
    const cards = document.querySelectorAll(".cards");

    const handleScroll = () => {
      const distance = window.innerHeight / 2;
      const topval = stackArea.getBoundingClientRect().top;
      let index = -1 * (topval / distance + 1);
      index = Math.floor(index);

      for (let i = 0; i < cards.length; i++) {
        if (i <= index) {
          cards[i].classList.add("away");
        } else {
          cards[i].classList.remove("away");
        }
      }

      rotateCards();
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <div className="stackarea h-[300vh] w-full bg-orange-100 flex">
        <div className="w-1/2  basis-[50%] sticky top-0 h-dvh">
          <div className="h-full w-full  flex items-center justify-center">
            <h1 className="text-7xl text-sky-900 font-bold">What we OFFER !!</h1>
          </div>
        </div>
        <div className="w-1/2  basis-[50%] relative sticky top-0 h-dvh">
          <div className="cards shadow-2xl h-140 w-140 absolute top-1/5 shadow-black left-1/5  border-1 rounded-xl flex justify-center border-l-43 border-r-43 border-blue-200 text-xl font-medium bg-blue-200 items-center">
            {" "}
            Create a captivating profile with images, videos, and a compelling
            bio that highlights your talent and experience. Manage Your Gigs:
            Easily track your bookings, update availability, and get real-time
            notifications. Get Paid Securely: Receive hassle-free, timely
            payments with seamless integrations. Grow Your Reputation: Collect
            ratings and reviews to enhance your visibility in the gig community.{" "}
          </div>
          <div className="cards h-140 w-140 absolute shadow-black bg-blue-300 top-1/5 left-1/5 border-1 rounded-xl shadow-2xl flex justify-center  border-l-43 border-r-43 border-blue-300 text-xl font-medium items-center">
            <p>
              {" "}
              Browse a wide range of performers—musicians, magicians, comedians,
              dancers, and more. Filter & Find: Search by category, price,
              availability, and location to find your perfect match. Hassle-free
              Bookings: Send gig requests, confirm availability, and make secure
              payments—all in one place.
            </p>
          </div>
          
          <div className="cards h-140 w-140 bg-sky-800 shadow-black absolute top-1/5 left-1/5 shadow-2xl rounded-xl flex justify-center items-center ">
            {" "}
            <button    onClick={handlenavigate} className=" w-73 h-33 rounded-xl shadow-black shadow-2xl hover:scale-107  bg-gradient-to-t from-sky-500 to-sky-900 text-black text-2xl font-bold transition-all border-0 ease-in-out duration-200 hover:text-white ">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default uf;
