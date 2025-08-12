import React, { useEffect, useState } from "react";
import API from "../API/API";
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import "./css/review.css";
import { GetReviewRating } from "../Functions/GetAverageRating";

function ReviewSection({ shoeId, from, status }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImages, setReviewImages] = useState([]);

  const fetchReviews = (shoeId) => {
    API.get(`/reviews/${shoeId}`).then(res => setReviews(res.data));
  };

  useEffect(() => {
    fetchReviews(shoeId);
  }, [shoeId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const addReview = () => {
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("rating", rating);
    reviewImages.forEach(img => {
      if (img) formData.append("images", img);
    });

    API.post(`/reviews/${shoeId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(() => {
      setComment("");
      setRating(5);
      setReviewImages([]);
      fetchReviews(shoeId);
    });
  };

  return (
    <div className="rs-container">
      {(from && from === "orders") && (
        <>
          <textarea
            placeholder="Write a review..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="rs-textarea"
          />

          <div className="rs-stars">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= rating ? (
                <StarIcon
                  key={star}
                  sx={{ color: "#ffc107", fontSize: 28 }}
                  onClick={() => setRating(star)}
                />
              ) : (
                <StarOutlineIcon
                  key={star}
                  sx={{ color: "#e4e5e9", fontSize: 28 }}
                  onClick={() => setRating(star)}
                />
              )
            )}
          </div>

          <div className="rs-image-upload">
            <div className="rs-preview-box">
              {reviewImages.map((img, i) => (
                <div className="rs-image-wrapper" key={i}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="rs-preview-image"
                  />
                  <button
                    type="button"
                    className="rs-remove-image"
                    onClick={() => removeImage(i)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="imageUpload" className="rs-plus-icon">+</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <button
            className="rs-post-btn"
            onClick={addReview}
            disabled={status !== "DELIVERED"}
          >
            Post
          </button>

          {status !== "DELIVERED" && (
            <p className="rs-disabled-msg">
              You can post a review only after the order is delivered.
            </p>
          )}
        </>
      )}

      {!from && (
        <>
          <h3 className="rs-title">Reviews ⭐</h3>
          {reviews.map((r, i) => (
            <div key={i} className="rs-review-item">
              <span className="rs-review-user">{r.username || r.user?.username}</span>
              <span className="rs-review-date">{r.createdAt}</span>
              <div><GetReviewRating rating={r.rating} /></div>
              <p className="rs-review-comment">{r.comment}</p>
              <div className="rs-review-images">
                {r.imageUrls?.map((img, j) => (
                  <img key={j} src={img} alt="review" />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default ReviewSection;
