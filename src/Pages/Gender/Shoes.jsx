import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import API from "../../API/API";
import { useNavigate, useParams } from "react-router-dom";
import {
  brands, discounts, weights, prices, colors, sizes,
  categories, genders, materials, ratings
} from "../../Functions/RequeredArrays.jsx";
import { GetAverageRating } from "../../Functions/GetAverageRating.jsx";
import { EmptyPage } from "../../Functions/EmptyPage.jsx";
import {
  FaSearch, FaPercent, FaWeightHanging, FaRupeeSign, FaTag,
  FaPalette, FaRuler, FaListUl, FaVenusMars, FaCubes, FaStar, FaTimes
} from "react-icons/fa";
import "./css/shoes.css";

function Shoes() {
  const [shoes, setShoes] = useState([]);
  const [filters, setFilters] = useState({
    name: "", brand: "", discount: "", weight: "",
    price: "", color: "", size: "", category: "",
    gender: "", material: "", rating: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();
  const { gender } = useParams();

  const filterIcons = {
    name: <FaSearch />, discount: <FaPercent />, weight: <FaWeightHanging />,
    price: <FaRupeeSign />, brand: <FaTag />, color: <FaPalette />,
    size: <FaRuler />, category: <FaListUl />, gender: <FaVenusMars />,
    material: <FaCubes />, rating: <FaStar />
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const fetchShoes = () => {
  setLoading(true);

  let url;
  let params = { page, size: 6, ...filters };

  if (Object.values(filters).some(v => v)) {
    // if any filter has value → call filter API
    url = "/shoes/filter";
  } else if (gender) {
    url = `/shoes/${gender}`;
    params = { page, size: 6, gender };
  } else {
    url = "/shoes/allShoes";
    params = { page, size: 6};
  }

  API.get(url, { params })
    .then(res => {
      setShoes(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    })
    .catch(err => console.log(err))
    .finally(() => setTimeout(() => setLoading(false), 500));
};


  useEffect(() => {
    fetchShoes();
    // eslint-disable-next-line
  }, [gender, page]);

  const searchShoes = () => {
    setPage(0); // reset to first page
    fetchShoes();
  };

  return (
    <div className={`shoe-container ${isFilterOpen ? "filter-open" : ""}`}>

      {/* Toggle Button */}
      <button className="filter-toggle react-icon-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
        {isFilterOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Filters */}
      <div className={`filters ${isFilterOpen ? "open" : ""}`}>
        {/* Name */}
        <div className="filter-group">
          <FaSearch className="filter-icon" />
          <input name="name" placeholder="Search Name" value={filters.name} onChange={handleChange} />
        </div>
        {/* Discount */}
        <div className="filter-group">
          <FaPercent className="filter-icon" />
          <select name="discount" value={filters.discount} onChange={handleChange}>
            <option value="">Min Discount %</option>
            {discounts.map(d => <option key={d} value={d}>{d}% +</option>)}
          </select>
        </div>
        {/* Weight */}
        <div className="filter-group">
          <FaWeightHanging className="filter-icon" />
          <select name="weight" value={filters.weight} onChange={handleChange}>
            <option value="">Max Weight (g)</option>
            {weights.map(w => <option key={w} value={w}>{w}g</option>)}
          </select>
        </div>
        {/* Price */}
        <div className="filter-group">
          <FaRupeeSign className="filter-icon" />
          <select name="price" value={filters.price} onChange={handleChange}>
            <option value="">Price</option>
            {prices.map(p => <option key={p} value={p}>₹{p.replace("-", " - ₹")}</option>)}
          </select>
        </div>
        {/* Brand */}
        <div className="filter-group">
          <FaTag className="filter-icon" />
          <select name="brand" value={filters.brand} onChange={handleChange}>
            <option value="">Brand</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        {/* Color */}
        <div className="filter-group">
          <FaPalette className="filter-icon" />
          <select name="color" value={filters.color} onChange={handleChange}>
            <option value="">Color</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {/* Size */}
        <div className="filter-group">
          <FaRuler className="filter-icon" />
          <select name="size" value={filters.size} onChange={handleChange}>
            <option value="">Size</option>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Category */}
        <div className="filter-group">
          <FaListUl className="filter-icon" />
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        {/* Gender */}
        {!gender && (
          <div className="filter-group">
            <FaVenusMars className="filter-icon" />
            <select name="gender" value={filters.gender} onChange={handleChange}>
              <option value="">Gender</option>
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        )}
        {/* Material */}
        <div className="filter-group">
          <FaCubes className="filter-icon" />
          <select name="material" value={filters.material} onChange={handleChange}>
            <option value="">Material</option>
            {materials.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        {/* Rating */}
        <div className="filter-group">
          <FaStar className="filter-icon" />
          <select name="rating" value={filters.rating} onChange={handleChange}>
            <option value="">Min Rating</option>
            {ratings.map(r => <option key={r} value={r}>{r} ★ & up</option>)}
          </select>
        </div>
        <button className="btn btn-primery filter-btn" onClick={searchShoes}>Search</button>
      </div>

      {/* Shoes Grid */}
      {loading ? (
        <div className="shoes-page">
          <EmptyPage text="Loading Shoes..." fullScreen={true} height="70vh" />
        </div>
      ) : (
        <div className="shoes-page">
          {/* Selected Filters */}
          {shoes.length > 0 && (
            <div className="selected-filters">
              {Object.keys(filters).map(key => (
                filters[key] && (
                  <div key={key} className="selected-filter">
                    <span className="selected-icon">{filterIcons[key]}</span>
                    {filters[key]}
                    <FaTimes
                      className="remove-filter"
                      onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))}
                    />
                  </div>
                )
              ))}
            </div>
          )}

          {/* Shoes Grid */}
          <div className="shoes-grid">
            {shoes.length > 0 ? shoes.map((shoe) => (
              <div key={shoe.id} className="shoe-card" onClick={() => navigate(`/user/shoes/details/${shoe.id}`)}>
                <div className="shoe-img">
                  <img src={shoe.imageUrls[0]} alt={shoe.name} />
                </div>
                <div className="shoe-body">
                  <h3>{shoe.brand}</h3>
                  <p className="shoe-name">{shoe.name}</p>
                  <GetAverageRating shoeId={shoe.id} />
                  <div className="prices">
                    <span className="shoe-after-discount">₹{shoe.priceAfterDiscount?.toFixed(2)}</span>
                    <span className="shoe-price">₹{shoe.salePrice?.toFixed(2)}</span>
                    <span className="shoe-discount">({shoe.discountParentage}% OFF) </span>
                  </div>
                  <div className="shoe-meta">
                    <div>
                      {shoe.colors?.length > 0 ? shoe.colors.map((color, index) => (
                        <span key={index} className="color-box" style={{ backgroundColor: color }} title={color}></span>
                      )) : <span>No colors</span>}
                    </div>
                    <div>
                      {shoe.sizes?.length > 0 ? shoe.sizes.map((size, index) => (
                        <span key={index} className="size-chip">{size}</span>
                      )) : <span>No sizes</span>}
                    </div>
                  </div>
                </div>
              </div>
            )) : <div className="shoes-page">
            <EmptyPage text="No Shoes Found" fullScreen={false} />
            </div>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>Prev</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={page >= totalPages - 1}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Shoes;
