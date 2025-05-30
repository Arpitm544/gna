import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const Performerinfo = () => {
  const { id } = useParams();
  const [performer, setPerformer] = useState(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    location: "",
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchPerformer = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/performers/${id}`);
        setPerformer(res.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch performer details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformer();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage("");
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://devops-1-4e4p.onrender.com/api/bookings`,
        {
          performerId: id,
          ...bookingData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingMessage("✅ Booking successful!");
      setShowForm(false);
      // Clear form data after successful booking
      setBookingData({ date: "", time: "", location: "" });
    } catch (err) {
      setBookingMessage(
        "❌ Booking failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg text-sky-900 font-semibold">
        Loading performer details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center text-lg font-semibold">{error}</p>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-sky-800 to-orange-200 py-10">
      <div className="w-[90%] max-w-6xl bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-6 relative">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-sky-900">
            {performer?.userId?.name || "Unnamed Performer"}
          </h2>
          <p className="text-xl text-sky-700 mt-2 border-b-2 pb-2 inline-block">
            {performer?.category || "Category not available"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-lg">
              <strong>Email:</strong> {performer?.userId?.email || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> {performer?.userId?.phone || "N/A"}
            </p>
            <div className="p-4 bg-sky-900 text-white rounded-2xl hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-2">About Me</h3>
              <p>{performer?.bio || "No bio available."}</p>
            </div>
            <div className="p-4 bg-blue-100 text-sky-900 rounded-2xl hover:shadow-xl transition">
              <h3 className="text-2xl font-bold mb-2">Price</h3>
              <p>₹{performer?.pricing ?? "N/A"}/hr</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 text-xl font-bold bg-green-700 text-white rounded-lg hover:bg-green-500 transition"
                aria-label="Open booking form"
              >
                Book Appointment
              </button>
            ) : (
              <form
                onSubmit={handleBookingSubmit}
                className="w-full bg-sky-800 p-6 rounded-2xl text-white shadow-lg space-y-4"
                aria-label="Booking form"
              >
                <div>
                  <label htmlFor="date" className="block text-lg font-bold">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    className="w-full border rounded-lg p-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-lg font-bold">
                    Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleBookingChange}
                    className="w-full border rounded-lg p-2 text-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-lg font-bold"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={bookingData.location}
                    onChange={handleBookingChange}
                    placeholder="Enter location"
                    className="w-full border rounded-lg p-2 text-black"
                    required
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all ease-in-out duration-300 ${
                      bookingLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setBookingMessage("");
                    }}
                    className="text-white hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {bookingMessage && (
              <p className="text-lg font-bold text-center mt-2">{bookingMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performerinfo;
