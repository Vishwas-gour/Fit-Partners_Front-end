import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../API/API.jsx";

// import "./css/shoeDetail.css";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";

function AdminShoesDetail() {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(0);
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);

  const fetchData = () =>{
      setLoading(true);
    const minTime = new Promise((resolve) => setTimeout(resolve, 500));
    const fetchData = API.get(`/shoes/details/${id}`);

    Promise.all([minTime, fetchData])
      .then(([, res]) => {
        setShoe(res.data);
        if (res.data.imageUrls?.length > 0) {
          setMainImage(res.data.imageUrls[0]);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
  fetchData()
  }, [id]);

  const handleUpdate = () => {
    navigate("/admin/shoes/add-shoes", { state: { shoe } });
  };

 

  const getRatingCount = (ratings) => {
    const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(r => {
      if (count[r] !== undefined) count[r]++;
    });
    return count;
  };

  if (loading) {
    return (
      <EmptyPage text="Loading Shoe..." height="80vh" width="100%" fontSize="40px" center />
    );
  }

  const ratingCount = getRatingCount(shoe.ratings || []);
  const totalRatings = shoe.ratings?.length || 0;
  const getPercentage = (count) => {
    return totalRatings === 0 ? 0 : (count / totalRatings) * 100;
  };
  console.log(shoe)
  return (
    <div className="sd-container">
      <div className="sd-shoe-detail">
        {/* Left side */}
        <div className="sd-left">
          <div className="sd-main-image">
            <img src={mainImage} alt="Main Shoe" />
          </div>
          <div className="sd-thumbnail-list">
            {shoe.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index}`}
                className={`sd-thumbnail ${mainImage === url ? "sd-active" : ""}`}
                onClick={() => setMainImage(url)}
              />
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="sd-right">
          <div className="sd-title">{shoe.name}</div>
          <div className="sd-desc">{shoe.description}</div>

          <div className="sd-available">
            <label>Color</label>
            <div className="sd-colors sd-meta-data">
              {shoe.colors.map((color, index) => (
                <div key={index} className="sd-color-circle" style={{ backgroundColor: color }}></div>
              ))}
            </div>
          </div>

          <div className="sd-available">
            <label>Size</label>
            <div className="sd-sizes sd-meta-data">
              {shoe.sizes.map((size, index) => (
                <div
                  key={index}
                  className={`sd-size-box ${selectedSize === size ? "sd-active-size" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  UK {size}
                </div>
              ))}
            </div>
          </div>

          <div className="sd-available">
            <label>Material</label> <div>{shoe.material}</div>
          </div>
          <div className="sd-available">
            <label>Weight</label> <div>{shoe.weight}g</div>
          </div>
          <div className="sd-available">
            <label>Stock</label> <div>{shoe.stock} peaces Available</div>
          </div>

          <div className="sd-price">
            <h4>₹{shoe.priceAfterDiscount.toFixed(2)}</h4>
            <span style={{ textDecoration: "line-through", color: "#777" }}>₹{shoe.salePrice}</span>
            <span style={{ color: "#ffffffff", fontWeight: "700" }}>({shoe.discountParentage}% OFF)</span>
          </div>

          <div className="sd-actions">
            <button onClick={() => handleUpdate(shoe)}>Update</button>
            
          </div>

          <div className="sd-rating-summary">
            <div className="sd-rating-left">
              <h2>{(shoe.ratings.reduce((a, b) => a + b, 0) / (totalRatings || 1)).toFixed(1)} ★</h2>
              <p>{totalRatings} Ratings</p>
            </div>
            <div className="sd-rating-right">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="sd-rating-row">
                  <span>{star} ★</span>
                  <div className="sd-bar">
                    <div className={`sd-fill sd-star-${star}`} style={{ width: `${getPercentage(ratingCount[star])}%` }}></div>
                  </div>
                  <span>{ratingCount[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminShoesDetail;
