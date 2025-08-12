import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchBoxIsVisible } from '../Redux/GlobalSlice';
import './css/search.css';
import API from '../API/API';
import { GetAverageRating } from '../Functions/GetAverageRating';

import { RxCross1 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Search() {
  const [name, setName] = useState("");
  const searchContainer = useSelector((state) => state.counts.search);
  const dispatch = useDispatch();
  const [shoes, setShoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      setShoes([]);
      return;
    }
    API.get("/shoes/byName", { params: { name } })
      .then(res => setShoes(res.data))
      .catch(err => console.log(err));
  }, [name]);

  function searchBoxHide() {
    dispatch(setSearchBoxIsVisible(false));
    setName("");
  }

  const navTo = (shoeId) => {
    searchBoxHide();
    navigate(`/user /shoes/details/${shoeId}`);
  };

  function renderCard() {
    return shoes.map((shoe) => (
      <div className='card' key={shoe.id} onClick={() => navTo(shoe.id)}>
        <div className='card-img'>
          <img className="shoe-image" src={shoe.imageUrls[0]} alt={shoe.name} />
        </div>
        <div className='card-body'>
          <div className='card-title'>{shoe.name}</div>
          <div className='card-price'>₹ {shoe.salePrice}</div>
          <GetAverageRating shoeId={shoe.id} />
        </div>
      </div>
    ));
  }

  return (
    <div className={`search-container ${searchContainer ? "full-search" : "half-search"}`}>
      <div className='searchBox'>
        <div className='searchInput'>
          <input
            type="text"
            placeholder='Search'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <h4 className='searchIcon'><IoSearchOutline /></h4>
        </div>
        <button className="cross" onClick={searchBoxHide}><RxCross1 /></button>
      </div>
      <div className='card-rows'>
        {!name ? (
          <p className='search-placeholder'>
            Search for products, shoe styles, product collections / categories or keywords
          </p>
        ) : (
          <div className='card-parent'>
            {renderCard()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
  