import React, { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import API from "../../API/API";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  brands, discounts, weights, prices, colors, sizes,
  categories, genders, materials, ratings
} from "../../Functions/RequeredArrays.jsx";
import { GetAverageRating } from "../../Functions/GetAverageRating.jsx";
import "./css/adminShoes.css";

function AdminShoes() {
  const [shoes, setShoes] = useState([]);
  const [filters, setFilters] = useState({
    name: "", brand: "", discount: "", weight: "",
    price: "", color: "", size: "", category: "",
    gender: "", material: "", rating: ""
  });
  const navigate = useNavigate();

  const { gender } = useParams();

  const [, setLoading] = useState(false);
  const fetchData = () => {
    const url = gender ? `/shoes/${gender}` : "/shoes/allShoes";
    setLoading(true);

    API.get(url)
      .then(res => setShoes(res.data))
      .catch(err => console.log(err))
      .finally(() => {
        setTimeout(() => setLoading(false), 500);
      });
  }

  useEffect(() => {
    fetchData()
  }, [gender]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleReset = () => {
    fetchData();
    setFilters({
    name: "", brand: "", discount: "", weight: "",
    price: "", color: "", size: "", category: "",
    gender: "", material: "", rating: ""
  })
  }

  const searchShoes = () => {
    if (gender) filters.gender = gender;
    API.get("/shoes/filter", { params: filters })
      .then(res => setShoes(res.data))
      .catch(err => console.log(err));
  };


  const adminShoesDetail = (id) => {
    navigate(`detail/${id}`)
    console.log(id)
  }
  return (
    <div className="admin-shoe-container">
      <h2>Admin Shoes Page</h2>

      {/* Filters on Top */}
      <div className="admin-filter-row">
        <input name="name" placeholder="Search Name" value={filters.name} onChange={handleChange} />
        <select name="discount" value={filters.discount} onChange={handleChange}>
          <option value="">Discount</option>
          {discounts.map(d => <option key={d} value={d}>{d}% +</option>)}
        </select>
        <select name="weight" value={filters.weight} onChange={handleChange}>
          <option value="">Weight</option>
          {weights.map(w => <option key={w} value={w}>{w}g</option>)}
        </select>
        <select name="price" value={filters.price} onChange={handleChange}>
          <option value="">Price</option>
          {prices.map(p => <option key={p} value={p}>₹{p.replace("-", " - ₹")}</option>)}
        </select>
        <select name="brand" value={filters.brand} onChange={handleChange}>
          <option value="">Brand</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select name="color" value={filters.color} onChange={handleChange}>
          <option value="">Color</option>
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="size" value={filters.size} onChange={handleChange}>
          <option value="">Size</option>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">Category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {!gender && (
          <select name="gender" value={filters.gender} onChange={handleChange}>
            <option value="">Gender</option>
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        <select name="material" value={filters.material} onChange={handleChange}>
          <option value="">Material</option>
          {materials.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="rating" value={filters.rating} onChange={handleChange}>
          <option value="">Min Rating</option>
          {ratings.map(r => <option key={r} value={r}>{r} ★ & up</option>)}
        </select>
        <button className="admin-search-btn" onClick={searchShoes}><FaSearch /></button>
        <button className="admin-add-shoe-btn" onClick={() => navigate("add-shoes")}>Add Shoes</button>
        <button className="admin-add-shoe-btn" onClick={() => handleReset()}>Reset Filters</button>
      </div>

      {/* Selected Filters Display */}
      <div className="admin-selected-filters">
        {Object.keys(filters).map(key => (
          filters[key] && (
            <div key={key} className="admin-selected-filter">
              {key}: {filters[key]}
              <FaTimes className="admin-remove-filter" onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))} />
            </div>
          )
        ))}
      </div>

      {/* Shoe Cards */}
      <div className="admin-shoes-grid">
        {shoes.length > 0 ? (
          shoes.map(shoe => (
            <div key={shoe.id} className="admin-shoe-card" onClick={() => adminShoesDetail(shoe.id)}>
              <img src={shoe.imageUrls[0]} alt={shoe.name} className="admin-shoe-img" />
              <div className="admin-shoe-details">
                <h3>{shoe.brand}</h3>
                <div>{shoe.name}</div>
                <GetAverageRating shoeId={shoe.id} />
                <div>
                  ₹{shoe.priceAfterDiscount?.toFixed(2)}{" "}
                  <span className="admin-original-price">₹{shoe.salePrice?.toFixed(2)}</span>
                </div>
                <p>{shoe.discountParentage}% OFF</p>
              </div>

            </div>
          ))
        ) : (
          <p>No shoes found</p>
        )}
      </div>
    </div>
  );
}

export default AdminShoes;
