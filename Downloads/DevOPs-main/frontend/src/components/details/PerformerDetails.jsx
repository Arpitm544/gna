// import React, { useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// const PerformerProfileForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const categoryOptions = [
//     "Artist",
//     "Comedian",
//     "Dancer",
//     "Entertainer",
//     "Event Service",
//     "Kids Entertainment",
//     "Magician",
//     "Musician",
//     "Speaker/Trainer",
//     "Special Performer",
//     "Traditional Performer",
//   ];

//   const subCategoryMap = {
//     Artist: [
//       "Live Painters",
//       "Sketch Artists",
//       "Calligraphers",
//       "Henna Artists",
//     ],
//     Comedian: ["Stand-up", "Improv", "Observational", "Dark Humor"],
//     Dancer: [
//       "Classical",
//       "Hip Hop",
//       "Contemporary",
//       "Folk",
//       "Street",
//       "Flash Mob",
//       "Choreographers",
//     ],
//     Entertainer: [
//       "Stand-up Comedians",
//       "Magicians",
//       "Clowns",
//       "Puppeteers",
//       "Storytellers",
//     ],
//     "Event Service": [
//       "Photographers",
//       "Videographers",
//       "Event Hosts/MCs",
//       "Event Planners",
//       "Decorators",
//       "Lighting and Sound Technicians",
//     ],
//     "Kids Entertainment": [
//       "Clowns",
//       "Balloon Artists",
//       "Face Painters",
//       "Mascots and Character Actors",
//     ],
//     Magician: ["Card Magic", "Illusion", "Mentalism", "Close-up Magic"],
//     Musician: [
//       "Classical",
//       "Pop",
//       "Jazz",
//       "Rock",
//       "Folk",
//       "Guitarists",
//       "Pianists",
//       "Violinists",
//       "Drummers",
//       "Rock Bands",
//       "Jazz Bands",
//       "Acoustic Bands",
//       "DJs",
//     ],
//     "Speaker/Trainer": [
//       "Motivational Speakers",
//       "Corporate Trainers",
//       "Workshop Conductors",
//     ],
//     "Special Performer": [
//       "Fire Performers",
//       "Acrobats",
//       "Aerial Artists",
//       "Stunt Performers",
//       "Circus Performers",
//     ],
//     "Traditional Performer": [
//       "Folk Singers",
//       "Puppet Show Artists",
//       "Bharatanatyam",
//       "Kathak",
//       "Street Play Artists",
//     ],
//   };

//   const [formData, setFormData] = useState({
//     category: "",
//     subCategory: "",
//     experience: "",
//     pricing: "",
//     specialties: [],
//     availability: {},
//     bio: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "category" ? { subCategory: "" } : {}),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     try {
//       const res = await axios.post(
//         `http://localhost:8083/api/performers/profile/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert("Profile created!");
//       navigate(`/performerdashboard/${id}`);
//     } catch (error) {
//       console.error(
//         "Profile creation failed:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="h-screen flex items-center bg-gradient-to-t from-sky-900 to-orange-100 justify-center">
//       <form
//         onSubmit={handleSubmit}
//         className="w-[45%] h-[70%] max-w-lg bg-white p-10 rounded-2xl shadow-2xl transition-shadow duration-300 "
//       >
//         <h2 className="text-4xl font-bold text-center text-gray-800">
//           Create Performer Profile
//         </h2>
//         <div className="p-2 mt-13">
//           {/* Category */}
//           <div className=" h-20 flex items-center gap-4 bg-blue-100 ">
//             <label className="block text-xl font-bold">Category:</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//               className="w-[50%] h-[60%] border border-1 rounded-lg"
//             >
//               <option value="">Select Category</option>
//               {categoryOptions.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* SubCategory */}
//           <div className="h-15 flex items-center gap-4 bg-blue-200">
//             <label className="block text-xl font-bold">Subcategory</label>
//             <select
//               name="subCategory"
//               value={formData.subCategory}
//               onChange={handleChange}
//               required
//               disabled={!formData.category}
//               className="w-[50%] border border-1 rounded-lg"
//             >
//               <option value="">Select SubCategory</option>
//               {formData.category &&
//                 subCategoryMap[formData.category]?.map((sub) => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* Experience */}
//           <div className="h-15 flex items-center gap-4 bg-blue-300">
//             <label className="block text-xl font-bold">
//               Experience (Years)
//             </label>
//             <input
//               name="experience"
//               type="number"
//               placeholder="Enter years of experience"
//               value={formData.experience}
//               onChange={handleChange}
//               className="w-[50%] h-[60%] border border-1 rounded-lg"
//               required
//             />
//           </div>

//           {/* Pricing */}
//           <div className="h-15 flex items-center gap-4 bg-blue-400">
//             <label className="block text-xl font-bold">Pricing (₹)</label>
//             <input
//               name="pricing"
//               type="number"
//               placeholder="Enter pricing"
//               value={formData.pricing}
//               onChange={handleChange}
//               className="w-[50%] h-[60%] border border-1 rounded-lg"
//               required
//             />
//           </div>

//           {/* Specialties */}
//           <div className="h-15 flex  items-center gap-4 bg-blue-500">
//             <label className="block text-xl font-bold">Specialties</label>
//             <input
//               name="specialties"
//               placeholder="Enter comma-separated specialties"
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   specialties: e.target.value.split(","),
//                 }))
//               }
//               className="w-[50%] h-[60%] border border-1 rounded-lg"
//             />
//           </div>

//           {/* Bio */}
//           <div className="h-20 flex items-center gap-4 bg-blue-600">
//             <label className="block text-xl font-bold">Bio</label>
//             <textarea
//               name="bio"
//               placeholder="Tell us about yourself"
//               onChange={handleChange}
//               rows="4"
//               className="w-[50%] h-[100%] border border-1 rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="h-20 flex justify-center items-center gap-4">
//           <button
//             type="submit"
//             onClick={() => navigate(`/performerdashboard/${id}`)}
//             className="w-[30%] h-[40%] rounded-lg flex justify-center items-center bg-blue-500 "
//           >
//             Create Profile
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PerformerProfileForm;
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PerformerProfileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryOptions = [
    "Artist", "Comedian", "Dancer", "Entertainer", "Event Service",
    "Kids Entertainment", "Magician", "Musician", "Speaker/Trainer",
    "Special Performer", "Traditional Performer",
  ];

  const subCategoryMap = {
    Artist: ["Live Painters", "Sketch Artists", "Calligraphers", "Henna Artists"],
    Comedian: ["Stand-up", "Improv", "Observational", "Dark Humor"],
    Dancer: ["Classical", "Hip Hop", "Contemporary", "Folk", "Street", "Flash Mob", "Choreographers"],
    Entertainer: ["Stand-up Comedians", "Magicians", "Clowns", "Puppeteers", "Storytellers"],
    "Event Service": ["Photographers", "Videographers", "Event Hosts/MCs", "Event Planners", "Decorators", "Lighting and Sound Technicians"],
    "Kids Entertainment": ["Clowns", "Balloon Artists", "Face Painters", "Mascots and Character Actors"],
    Magician: ["Card Magic", "Illusion", "Mentalism", "Close-up Magic"],
    Musician: ["Classical", "Pop", "Jazz", "Rock", "Folk", "Guitarists", "Pianists", "Violinists", "Drummers", "Rock Bands", "Jazz Bands", "Acoustic Bands", "DJs"],
    "Speaker/Trainer": ["Motivational Speakers", "Corporate Trainers", "Workshop Conductors"],
    "Special Performer": ["Fire Performers", "Acrobats", "Aerial Artists", "Stunt Performers", "Circus Performers"],
    "Traditional Performer": ["Folk Singers", "Puppet Show Artists", "Bharatanatyam", "Kathak", "Street Play Artists"],
  };

  const [formData, setFormData] = useState({
    category: "", subCategory: "", experience: "", pricing: "",
    specialties: [], bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subCategory: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `https://devops-1-4e4p.onrender.com/api/performers/profile/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile created!");
      navigate(`/performerdashboard/${id}`);
    } catch (error) {
      console.error("Profile creation failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-900 to-orange-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-transparent  rounded-3xl shadow-2xl shadow-black  p-10 space-y-6"
      >
        <h2 className="text-4xl font-bold text-center text-sky-900">
          Create Performer Profile
        </h2>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 p-3"
          >
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* SubCategory */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Subcategory</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
            disabled={!formData.category}
            className="rounded-lg border border-gray-300 p-3 disabled:bg-gray-200"
          >
            <option value="">Select Subcategory</option>
            {formData.category && subCategoryMap[formData.category]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            placeholder="Enter years of experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 p-3"
          />
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Pricing (₹)</label>
          <input
            type="number"
            name="pricing"
            placeholder="Enter pricing"
            value={formData.pricing}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 p-3"
          />
        </div>

        {/* Specialties */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Specialties (comma-separated)</label>
          <input
            name="specialties"
            placeholder="e.g., Salsa, Bollywood, Contemporary"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                specialties: e.target.value.split(","),
              }))
            }
            className="rounded-lg border border-gray-300 p-3"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-semibold text-gray-700">Bio</label>
          <textarea
            name="bio"
            placeholder="Tell us about yourself"
            rows="4"
            onChange={handleChange}
            className="rounded-lg border border-gray-300 p-3"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="w-1/2 bg-sky-900 text-white rounded-lg py-3 font-semibold hover:bg-sky-800 transition duration-300"
          >
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => navigate(`/signin`)}
            className="w-1/2 ml-4 bg-gray-500 text-white rounded-lg py-3 font-semibold hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerformerProfileForm;
