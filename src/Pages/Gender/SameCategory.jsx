import React, { useEffect, useState } from 'react';
import API from '../../API/API';
import { useNavigate } from 'react-router-dom';
import './css/sameCategory.css';

function SameCategory(props) {
  const [shoes1, setShoes1] = useState([]);
  const [shoes2, setShoes2] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/shoes/sameCategoryShoes", { params: props })
      .then(res => setShoes1(res.data))
      .catch(err => console.log(err));
    API.get("/shoes/oppositeGenderShoes", { params: props })
      .then(res => setShoes2(res.data))
      .catch(err => console.log(err));
  }, [props]);

  return (
    <div className="sc-container">
      <h2 className="sc-title">🧢 Similar Shoes</h2>

      {shoes1.length === 0 ? (
        <p className="sc-empty">No shoes found in this category.</p>
      ) : (
        <>
          <div className="sc-grid">
            {shoes1.map(shoe => (
              <div
                key={shoe.id}
                className="sc-card"
                onClick={() => navigate(`/user/shoes/details/${shoe.id}`)}
              >
                <img src={shoe.imageUrls[0]} alt={shoe.name} className="sc-img" />
                <h4 className="sc-name">{shoe.name}</h4>
                <p className="sc-price">
                  <s>₹{shoe.salePrice}</s> &nbsp;
                  <b>₹{shoe.priceAfterDiscount.toFixed(2)}</b>
                  <span className="sc-discount">({shoe.discountParentage}% OFF)</span>
                </p>
                <p className="sc-desc">
                  {shoe.description.length > 20
                    ? shoe.description.substring(0, 40) + "..."
                    : shoe.description}
                </p>
              </div>
            ))}
          </div>

          <h2 className="sc-title">🧢 Bought Together</h2>

          <div className="sc-grid">
            {shoes2.map(shoe => (
              <div
                key={shoe.id}
                className="sc-card"
                onClick={() => navigate(`/user/shoes/details/${shoe.id}`)}
              >
                <img src={shoe.imageUrls[0]} alt={shoe.name} className="sc-img" />
                <h4 className="sc-name">{shoe.name}</h4>
                <p className="sc-price">
                  <s>₹{shoe.salePrice}</s> &nbsp;
                  <b>₹{shoe.priceAfterDiscount.toFixed(2)}</b>
                  <span className="sc-discount">({shoe.discountParentage}% OFF)</span>
                </p>
                <p className="sc-desc">
                  {shoe.description.length > 20
                    ? shoe.description.substring(0, 40) + "..."
                    : shoe.description}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SameCategory;
