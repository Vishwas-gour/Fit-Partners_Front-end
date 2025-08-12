import { Outlet } from 'react-router-dom';
import SideBar from "../NonOutlets/SideBar";
import "./css/layout.css"; // make sure path is correct

const AdminLayout = () => {
  return (
    <div className="layout">
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
