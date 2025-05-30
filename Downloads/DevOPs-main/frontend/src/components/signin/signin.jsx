import React, { useState } from "react";
import SignInPicture from "../animate/lottie2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loadingg from "../animate/loading";


const Signin = () => {
  const [form, setForm] = useState({ phone: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { phone, password } = form;

    if (!phone || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(phone) ) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true); 
    try {
      const res = await axios.post(
        `https://devops-1-4e4p.onrender.com/api/users/login`,
        {
          phone: Number(phone),
          password,
        }
      );

      const { user, token } = res.data;
      localStorage.setItem("token", token);

      if (user.type === 1) {
        navigate(`/performerdashboard/${user.id}`);
      } else {
        navigate(`/userdashboard/${user.id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-sky-950 to-orange-100">
      {loading ? (
        <Loadingg />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-30 max-w-6xl h-full">
          <div className="flex flex-col w-[100%] h-[80%] items-center justify-center pt-8">
            <h1 className="text-5xl font-bold mt-20 text-center">WELCOME</h1>
            <SignInPicture />
          </div>
        
          <div className="flex flex-col h-150 w-150 items-center justify-center p-8">
            <div className="shadow-xl rounded-2xl h-[100%] shadow-black w-full max-w-md p-23">
              <h2 className="text-3xl font-bold text-center mb-6">LOGIN</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Your Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border-2 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border-2 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-sky-900 text-white rounded-xl hover:bg-sky-800 transition duration-300"
                >
                  LOGIN
                </button>
              </form>

              <p className="text-center mt-4">
                New User?{" "}
                <a href="/signup" className="text-sky-900 font-semibold hover:underline">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
