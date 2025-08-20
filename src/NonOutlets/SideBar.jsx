import { NavLink, useNavigate } from "react-router-dom";
import "./css/sideBar.css";


const SideBar = () => {
  const role = localStorage.getItem("role");
 
  const nav = useNavigate();

  const adminLinks = [
    { to: "/admin/profile", icon: "👤", label: "Profile" },
    { to: "/admin/analytics", icon: "📊", label: "Analytics" },
    { to: "/admin/shoes", icon: "👟", label: "Shoes" },
    { to: "/admin/users", icon: "👥", label: "Users" },
    { to: "/admin/employees", icon: "👷", label: "Employees" },
    { to: "/admin/orders", icon: "📦", label: "Orders" },
  ];

  const employeeLinks = [
    { to: "/employee/profile", icon: "👤", label: "Profile" },
    { to: "/employee/assigned-orders", icon: "📋", label: "Assigned Orders" },
    { to: "/employee/history", icon: "📈", label: "History" },
    // { to: "/employee/contact", icon: "📞", label: "Contact Service" },
  ];

  const handleLogout = () => {
        localStorage.clear();
        nav("/login"); // change to your login path
    };
  // Inside SideBar
  

  const links = role === "ROLE_ADMIN" ? adminLinks : employeeLinks;
  const title = role === "ROLE_ADMIN" ? "Admin Panel" : "Employee Panel";

  return (
    <div className='sidebar'>
  

      <h2 className="sidebar-title">{title}</h2>
      <nav className="sidebar-nav">
        {links.map((link, index) => (
          <NavLink key={index} to={link.to} className="sidebar-link">
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        <button className="sidebar-link logout" onClick={()=> handleLogout()}>
          <span className="sidebar-icon" >🚪</span>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default SideBar;
