import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [category, setCategory] = useState(""); 
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password || !category) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(Number(phone)) || phone.length !== 10) {
      alert("Please enter a valid 10-digit numeric phone number");
      return;
    }

    const payload = {
      name,
      email,
      phone: Number(phone),
      password,
      type: category === "user" ? 0 : 1,
    };

    try {
      const res = await fetch(`https://devops-1-4e4p.onrender.com/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        const userId = data.user?.id;
        if (category === "performer" && userId) {
          navigate(`/performer/${userId}`);
        } else {
          navigate("/signin");
        }
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error during signup: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-sky-950 to-orange-100 p-4">
      <div className="w-full max-w-md bg-transparent rounded-2xl shadow-2xl z-[2] shadow-black p-8">
        <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border-2 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border-2 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
          />
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border-2 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
          >
            <option value="">Select Category</option>
            <option value="user">User</option>
            <option value="performer">Performer</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-sky-900 text-white rounded-xl hover:bg-sky-800 transition duration-300"
          >
            SIGN UP
          </button>
        </form>
        <p className="text-center mt-4">
          Already Registered?{" "}
          <a href="/signin" className="text-gray-300 font-semibold hover:underline">
            LOGIN
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
