import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loadingg from "../animate/loading";
import Footer from "../footer/footer";


const BookingsByPerformer = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [performer, setPerformer] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id, token]);

  useEffect(() => {
    const fetchPerformer = async () => {
      try {
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/performers/${id}`);
        setPerformer(res.data);
      } catch (err) {
        console.error(
          err.response?.data?.message || "Failed to fetch performer details"
        );
      }
    };

    fetchPerformer();
  }, [id]);

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await axios.put(
        `https://devops-1-4e4p.onrender.com/api/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: res.data.booking.status }
            : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const handleYourProfile = () => {
    navigate(`/performerprofile/${id}`);
  };

  const filteredBookings = bookings.filter((booking) =>
    filterStatus === "All" ? true : booking.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loadingg />
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full bg-orange-100">
        <div className="h-[30%] w-full p-20 text-9xl font-bold">
          <h1>Welcome {performer?.userId?.name}</h1>
          <h1 className="text-2xl font-medium pl-2">Performer Dashboard</h1>
        </div>

        <div className="h-[20%] text-sky-900 flex items-center text-9xl pl-20">
          <h1 className="font-bold">Your Bookings</h1>
        </div>

        <div className="flex gap-4 justify-center my-6">
          {["All", "Pending", "Confirmed", "Rejected"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg shadow ${
                filterStatus === status
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-sky-600 text-sky-600"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="h-[40%] w-full flex justify-center">
          <div className="h-full w-[90%] pt-20 flex justify-center">
            {filteredBookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings found.</p>
            ) : (
              <div className="grid grid-cols pb-10 gap-8 w-full max-w-6xl">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-sky-900 p-6 shadow-xl rounded-xl text-white hover:shadow-2xl hover:scale-105 transition duration-300"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Booking Date: {new Date(booking.date).toLocaleDateString()}
                    </h3>
                    <p><strong>Location:</strong> {booking.location}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Payment:</strong> {booking.paymentStatus}</p>

                    {booking.status === "Pending" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                          onClick={() => handleUpdateStatus(booking._id, "Confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium"
                          onClick={() => handleUpdateStatus(booking._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BookingsByPerformer;
