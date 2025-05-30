import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PerformerProfile = () => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchPerformerDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8083/api/performers/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDetails(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Error fetching performer details:', err);
      }
    };

    fetchPerformerDetails();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Performer Profile</h2>
      {details ? (
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Name:</strong> {details.userId?.name}</p>
          <p><strong>Email:</strong> {details.userId?.email}</p>
          <p><strong>Phone:</strong> {details.userId?.phone}</p>
          <p><strong>Category:</strong> {details.category}</p>
          <p><strong>Subcategory:</strong> {details.subCategory}</p>
          <p><strong>Specialties:</strong> {details.specialties.join(', ')}</p>
          <p><strong>Experience:</strong> {details.experience} years</p>
          <p><strong>Pricing:</strong> ₹{details.pricing}</p>
          {/* <p><strong>Availability:</strong> 
            {Object.entries(details.availability).map(([day, time]) => (
              <span key={day}> {day}: {time}; </span>
            ))}
          </p> */}
          <p><strong>Rating:</strong> {details.rating} ⭐</p>
          <p><strong>Bio:</strong> {details.bio}</p>
        </div>
      ) : (
        <p>Loading performer details...</p>
      )}
    </div>
  );
};

export default PerformerProfile;
