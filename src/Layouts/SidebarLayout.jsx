import { Outlet } from 'react-router-dom';
import SideBar from "../NonOutlets/SideBar";
import "./css/layout.css"; // make sure path is correct
import { useState } from "react";
const AdminLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  return (
    <div className="layout">
  
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="content">
        <Outlet />
            <button onClick={toggleTheme} className="sidebar-theme-toggle">
        {isDarkMode ? "☀️ Light" : "🌙 Dark"} Mode
      </button>
      </div>
    </div>
  );
};

export default AdminLayout;
