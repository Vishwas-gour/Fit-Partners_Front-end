import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import AnimatedBanner from './AnimatedBanner';
import './css/nav.css';
// import './css/search.css';

import { SlLocationPin } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { PiShoppingCartThin, PiHeartThin } from "react-icons/pi";
import { CiDeliveryTruck } from "react-icons/ci";
import { BsPlusCircle } from "react-icons/bs";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import { setSearchBoxIsVisible } from '../Redux/GlobalSlice';
import { useState, useEffect } from 'react';

function MyNav() {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const cartCount = useSelector((state) => state.counts.cartCount);
    const wishlistCount = useSelector((state) => state.counts.wishlistCount);
    const orderCount = useSelector((state) => state.counts.orderCount);
    const username = localStorage.getItem("username");
    const [showLogout, setShowLogout] = useState(false);

    const [rotate, setRotate] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const handleLogout = () => {
        localStorage.clear();
        nav("/login"); // change to your login path
    };
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const toggleRotate = () => setRotate(prev => !prev);

    const unhideSearchBox = () => {
        dispatch(setSearchBoxIsVisible(true));
    };

    return (
        <>
            {/* Top bar */}
            <div className="myNav-top-bar">
                <button className="myNav-theme-toggle" onClick={toggleTheme} title="Toggle theme">
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
                <div className="myNav-profile">
                    <button><SlLocationPin /> address</button> |
                    <div className="profile-container" onMouseEnter={() => setShowLogout(true)} onMouseLeave={() => setShowLogout(false)}>
                        <button className="profile-btn"> <CgProfile /> {username} </button>
                        {showLogout && (
                            <button className="logout-btn" onClick={handleLogout}> Logout </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main navbar */}
            <div className={`myNav-main ${rotate ? "open" : ""}`}>
                <ul className="myNav-left">
                    <Link to='/' className="myNav-logo">FitPartners.com</Link>
                </ul>

                <ul className="myNav-center">
                    <NavLink to="user/shoes" end className={({ isActive }) => isActive ? "myNav-active" : ""}>Shoes</NavLink> |
                    <NavLink to="user/shoes/men" end className={({ isActive }) => isActive ? "myNav-active" : ""}>Men</NavLink> |
                    <NavLink to="user/shoes/women" end className={({ isActive }) => isActive ? "myNav-active" : ""}>Women</NavLink> |
                    <NavLink to="user/shoes/kids" end className={({ isActive }) => isActive ? "myNav-active" : ""}>Kids</NavLink>
                </ul>

                <ul className="myNav-right">
                    <button className="react-icon-btn" onClick={unhideSearchBox}><CiSearch /></button>
                    <button className="react-icon-btn" onClick={() => nav("user/cart")}><PiShoppingCartThin /><span>{cartCount}</span></button>
                    <button className="react-icon-btn" onClick={() => nav("user/wishlist")}><PiHeartThin /><span>{wishlistCount}</span></button>
                    <button className="react-icon-btn" onClick={() => nav("user/orderList")}><CiDeliveryTruck /><span>{orderCount}</span></button>
                </ul>

                <button className="myNav-toggle-btn" onClick={toggleRotate}>
                    {rotate ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
                </button>
            </div>
        
    
        </>
    );
}

export default MyNav;
