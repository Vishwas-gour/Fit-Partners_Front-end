import React, { useEffect, useState } from 'react';
import API from "../API/API.jsx";
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import './css/GetAverageRating.css';
import { FaStar } from "react-icons/fa";
export const GetAverageRating = ({ shoeId }) => {
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (!shoeId) return;
    API.get(`/reviews/averageRating/${shoeId}`)
      .then(res => {
        setAvgRating(res.data || 0);
      })
      .catch(err => {
        console.error("Error fetching average rating:", err);
      });
  }, [shoeId]);

  // Generate star icons
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<StarIcon key={i} className="star full" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalfIcon key={i} className="star half" />);
      } else {
        stars.push(<StarOutlineIcon key={i} className="star empty" />);
      }
    }
    return stars;
  };

  return (
    <div className="rating-stars">
      {renderStars(avgRating)}
    </div>
  );
};





export const GetReviewRating =  ({ rating, setRating }) =>  {
  return (
    <div style={{ display: "flex", gap: "5px", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} size={24} color={star <= rating ? "#ffc107" : "#e4e5e9"}
          onClick={() => setRating(star)}/>
      ))}
    </div>
  );
}
