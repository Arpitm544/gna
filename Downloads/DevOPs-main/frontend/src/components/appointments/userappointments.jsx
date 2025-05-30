import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LottiePic from "../animate/lottie4";
import Loadingg from "../animate/loading";


const Userappointments = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://devops-1-4e4p.onrender.com/api/bookings/by-client/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  const handlePaymentRedirect = (bookingId, price) => {
    navigate(`/payment/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loadingg />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className='h-30 w-full flex items-center bg-gradient-to-b from-sky-900 to-white border-sky-900 text-black'>
        <h2 className="text-5xl font-bold mb-4 ml-10 text-center">Your Appointments</h2>
      </div>

      <div className='w-full grid grid-cols-2 border-white justify-center'>
        <div className=''>
          <div className='h-200 w-200 fixed'>
            <LottiePic />
          </div>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No appointments found.</p>
        ) : (
          <div className="grid gap-6 w-[90%] mx-auto">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-sky-900 text-white rounded-2xl hover:shadow-xl hover:scale-102 transition-all ease-in-out duration-300 p-5">
                <h3 className="text-lg font-semibold mb-1">
                  Performer: {booking.performerName || "Unknown"}
                </h3>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <p><strong>Status:</strong> {booking.status || "Pending"}</p>
                <p><strong>Payment:</strong> {booking.paymentStatus || "Unpaid"}</p>

                {booking.status === "Confirmed" && booking.paymentStatus !== "Paid" && (
                  <button
                    onClick={() => handlePaymentRedirect(booking._id, booking.pricing)}
                    className="bg-indigo-600 hover:bg-orange-100 hover:text-black w-43 h-12 text-white rounded"
                  >
                    Make Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Userappointments;
