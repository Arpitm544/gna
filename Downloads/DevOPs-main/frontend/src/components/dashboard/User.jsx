import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Loadingg from "../animate/loading";
import Footer from "../footer/footer";

const PerformerCard = ({ performer, index }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <Link
      ref={ref}
      to={
        performer.userId?._id ? `/performerinfo/${performer.userId._id}` : "#"
      }
      key={performer.userId?._id || performer._id}
      className={`bg-sky-900 h-60 rounded-2xl border-30 text-xl border-sky-900 text-white shadow-xl hover:scale-110 transition-all duration-400 ease-out
      ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      relative z-[${50 - index}] w-full`}
    >
      <h3 className="text-3xl font-semibold text-white mb-1">
        {performer.userId?.name || "Unnamed Performer"}
      </h3>
      <p><strong>Category:</strong> {performer.category}</p>
      <p><strong>Sub-Category:</strong> {performer.subCategory}</p>
      <p><strong>Pricing:</strong> ₹{performer.pricing}</p>
      <span className="inline-block mt-4 font-medium hover:underline transition-all duration-700 ease-out">
        View Details →
      </span>
    </Link>
  );
};

const User = () => {
  const [performers, setPerformers] = useState([]);
  const [filteredPerformers, setFilteredPerformers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPerformers = async () => {
      try {
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/performers/`);
        setPerformers(res.data);
        const uniqueCategories = Array.from(new Set(res.data.map(p => p.category))).filter(Boolean);
        setCategories(uniqueCategories);

      } catch (err) {
        setError(err.message || "Failed to fetch performers");
      } finally {
        setLoading(false);
      }
    };
    fetchPerformers();
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredPerformers(performers);
    } else {
      const filtered = performers.filter(p => p.category === selectedCategory);
      setFilteredPerformers(filtered);
    }
  }, [performers, selectedCategory]);

  const handleYourAppointment = () => {
    navigate(`/user/appointments/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loadingg />
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-screen bg-gradient-to-b mb-12 from-orange-100 to-white justify-center">
        <div className="container m-auto w-screen">
          <div className="heading h-full">
            <div className="h-[6%] ml-10 font-bold text-8xl">
              <h1 className="pt-20">WELCOME,{user?.name||'Guest'} </h1>
            </div>
            <div className="h-[10%] mt-8">
              <h2 className="text-7xl font-bold text-transparent ml-5 bg-clip-text bg-gradient-to-r from-sky-900 to-orange-100 border-orange-100">
                Discover Talented Performers
              </h2>
              <div className="flex h-17 items-center text-xl text-sky-900 ml-10 border-orange-100 font-medium w-[50%]">
                <h1>
                  Find extraordinary performers who will transform your event into an unforgettable experience
                </h1>
              </div>
            </div>

           
            <div className="my-8 ml-10">
              
              <div className="flex space-x-183">
<label htmlFor="categoryFilter" className="font-semibold mr-4 text-xl text-sky-900">
                Filter by Category:
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-sky-900 h-10 w-40 rounded-md px-4 py-2"
              >
                <option value="All">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div>
                 <button
              onClick={handleYourAppointment}
              className="text-white font-semibold  w-60 h-20  z-[100] rounded-lg bg-sky-900 hover:shadow-xl hover:scale-105 hover:bg-sky-950 hover:shadow-black  transition-all duration-400 ease-in-out"
            >
              Your Appointments
            </button>

              </div>

              </div>
            </div>

           

            <div className="w-full h-[84%] mt-20 justify-center">
              <div className="w-full h-full md:w-full border-orange-100 flex flex-col items-center justify-center relative">
                {error ? (
                  <p className="text-center text-red-500 text-lg">{error}</p>
                ) : filteredPerformers.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg">
                    No performers available for the selected category.
                  </p>
                ) : (
                  <div className="w-[80%] grid grid-cols gap-8">
                    {filteredPerformers.map((performer, index) => (
                      <PerformerCard
                        performer={performer}
                        index={index}
                        key={performer._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Footer />
      </div>
    </>
  );
};

export default User;
