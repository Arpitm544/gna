import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentPic from "../animate/paymentlottie";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [price, setPrice] = useState(null);
  const [performer, setPerformer] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://devops-1-4e4p.onrender.com/api/bookings/price/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooking(res.data.booking);
        setPrice(res.data.price);
        setPerformer(res.data.performers);
      } catch (err) {
        setError("Error fetching booking details");
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      const amount = price;

      const orderRes = await axios.post(
        `https://devops-1-4e4p.onrender.com/api/payment/createOrder`,
        { amount }
      );

      const { id: order_id, amount: orderAmount, currency } = orderRes.data;

      const options = {
        key: "rzp_test_L1sqG4NKJOJaSb",
        amount: orderAmount,
        currency,
        name: performer?.name,
        description: "Booking Payment",
        order_id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `https://devops-1-4e4p.onrender.com/api/payment/verifyPayment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount:price,
            }
          );

          if (verifyRes.data.message === "Payment verified") {
            await axios.put(
              `https://devops-1-4e4p.onrender.com/api/bookings/${bookingId}/payment`,
              { paymentStatus: "Paid" },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            alert("Payment Successful!");
            navigate("/");
          }
        },
        prefill: {
          name: "User",
          email: "user@example.com",
        },
        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Payment failed to initiate.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-center">
      {/* Header */}
      <div className="h-[20%] flex items-center justify-center border-sky-900 p-6 md:p-10 bg-sky-900 text-white">
        <h1 className="text-4xl md:text-7xl font-bold">Your Payment</h1>
      </div>

      {/* Main Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 bg-gray-100">
        {/* Left Column - Animation */}
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-xs md:max-w-md lg:max-w-lg">
            <PaymentPic />
          </div>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="flex items-center justify-center p-6">
          {error && <p className="text-red-500">{error}</p>}
          {booking ? (
            <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
                Booking Summary
              </h1>

              <div className="space-y-4 text-left">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-lg font-semibold text-gray-600">Performer:</span>
                  <span className="text-lg font-bold text-gray-900">{performer?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-lg font-semibold text-gray-600">Date:</span>
                  <span className="text-lg text-gray-900">{booking.date ? new Date(booking.date).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-lg font-semibold text-gray-600">Time:</span>
                  <span className="text-lg text-gray-900">{booking.time || "-"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-lg font-semibold text-gray-600">Location:</span>
                  <span className="text-lg text-gray-900 text-right max-w-[60%]">{booking.location || "-"}</span>
                </div>
                <div className="flex justify-between items-center py-4 mt-6 bg-sky-50 rounded-lg px-4">
                  <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-sky-800">₹{price}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-lg md:text-xl font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Pay with Razorpay
              </button>
            </div>
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
