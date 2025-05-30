// import React, { use } from 'react'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'


// const loader = () => {
//   const navigate = useNavigate();
//   const array = ["","","","Musicians", "DJ's","Dancers","Magicians","Comedians","Singers","Entertainers","Models","Actors","Actresses","Performers","Artists","Celebrities","Influencers","Impersonators","Voice Over Artists","Musical Artists","Vocalists","Rappers","Songwriters","Lyricists","Producers","Directors","Writers","DJs" ,"Dancers" ,"Magicians" ,"Comedians" ,"Singers" ,"Entertainers" ,"Models" ,"Actors" ,"Actresses" ,"Performers" ,"Artists" ,"Celebrities" ,"Influencers" ,"Impersonators" ,"Voice Over Artists" ,"Musical Artists" ,"Vocalists" ,"Rappers" ,"Songwriters" ,"Lyricists" ,"Producers" ,"Directors"];
//   // const array =["welcome", "to","our","website","we","are","glad","to","see","you","here"];

//   const [index, setIndex] = useState(0);
//   const [showmask, setmask] = useState(false);


//   useEffect(()=>{
//     const interval =setInterval(()=>{
//       setIndex((prevIndex)=>{

//         for(let i = 0; i < array.length; i++) {
//           if (prevIndex === array.length - 1) {
//             return 0;
//           } else {
//             return prevIndex + 1;
//           }
        
//         }
//        })
//     },200)
//     return () => clearInterval(interval)
//   },[])
//   useEffect(()=>{
//     const timeout = setTimeout(()=>{
//       navigate('/signup');
//     },10000)
//     return () => clearTimeout(timeout)
//   },[navigate])

  


//   return (

//     <div className='loader-bg'>
//       <div className='loader-numbers'>
//         <h1>{array[index]}</h1>
//       </div>
     
      
//     </div>
//   );
// }

// export default loader;
import React, { useState, useEffect } from "react";

const words = [
  "Musicians", "DJ's", "Dancers", "Magicians", "Comedians", "Singers",
  "Entertainers", "Models", "Actors", "Actresses", "Performers", "Artists", "Celebrities",
  "Influencers", "Impersonators", "Voice Over Artists", "Musical Artists", "Vocalists",
  "Rappers", "Songwriters", "Lyricists", "Producers", "Directors", "Writers", "DJs", "Dancers",
  "Magicians", "Comedians", "Singers", "Entertainers", "Models", "Actors", "Actresses",
  "Performers", "Artists", "Celebrities", "Influencers", "Impersonators", "Voice Over Artists",
  "Musical Artists", "Vocalists", "Rappers", "Songwriters", "Lyricists", "Producers", "Directors"
];

const Loader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText("");
      setTimeout(() => {
        setDisplayedText(words[currentIndex]);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 100); 
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="background-screen h-full w-full ">
      <div className="typewriter-text h-90 w-full flex items-center 
      border-l-33 border-orange-100 text-sky-900 text-8xl font-bold">
        {displayedText}
      </div>
    </div>
  );
};

export default Loader;