import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layouts
import UserLayout from "./Layouts/UserLayout.jsx";
import SidebarLayout from "./Layouts/SidebarLayout.jsx";


// AuthPages
import Home from "./Pages/Home.jsx";
import ChatBot from "./Pages/ChatBot.jsx";
import Login from './Pages/AuthPages/Login.jsx';
import SignUp from './Pages/AuthPages/SignUp.jsx';
import ForgetPassword from './Pages/AuthPages/ForgetPassword.jsx';

// Admin Pages
import MyProfile from "./Components/MyProfile.jsx";
import AddShoe from './Pages/AdminPages/AddShoe.jsx';
import AdminShoes from './Pages/AdminPages/AdminShoes.jsx';
import AdminShoesDetail from './Pages/AdminPages/AdminShoesDetail.jsx';
import Analytics from './Pages/AdminPages/Analytics.jsx';
import Users from './Pages/AdminPages/Users.jsx';
import UserDetails from './Pages/AdminPages/UserDetails.jsx';
import Employees from './Pages/AdminPages/Employees.jsx';
import EmployeeDetails from "./Pages/AdminPages/EmployeeDetails.jsx";
import AdminOrders from './Pages/AdminPages/AdminOrders.jsx';

// Employee Pages
import AssignedOrders from './Pages/EmployeePages/AssignedOrders.jsx';
import DeliveryHistory from './Pages/EmployeePages/DeliveryHistory.jsx';
import ContactService from './Pages/EmployeePages/ContactService.jsx';

// User Pages
import Shoes from './Pages/Gender/Shoes.jsx';
import SameCategory from './Pages/Gender/SameCategory.jsx';
import ShoeDetail from './Pages/ShoeDetail.jsx';
import Cart from './Pages/UserPages/Cart.jsx';
import Wishlist from './Pages/UserPages/Wishlist.jsx';
import OrdersList from './Pages/UserPages/OrderList.jsx';
import PaymentForm from './Pages/UserPages/PaymentForm.jsx';

import NotFound from "./Pages/NotFound.jsx";
import WelcomPage from "./Components/WelcomePage.jsx"
import "./Utils/css/util.css";

function App() {
  const role = localStorage.getItem("role"); // Default role logic can be improved
  console.log("role", role);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/" element={<WelcomPage />} />

        {/* ===== Admin Routes ===== */}
        {role === "ROLE_ADMIN" && (
          <Route path="/admin" element={<SidebarLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="shoes" element={<AdminShoes />} />
            <Route path="shoes/detail/:id" element={<AdminShoesDetail />} />
            <Route path="shoes/add-shoes" element={<AddShoe />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:email" element={<UserDetails />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:email" element={<EmployeeDetails />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}

        {/* ===== Employee Routes ===== */}
        {role === "ROLE_EMPLOYEE" && (
          <Route path="/employee" element={<SidebarLayout />}>
            <Route index element={<MyProfile />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="assigned-orders" element={<AssignedOrders />} />
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="contact-service" element={<ContactService />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}

        {/* ===== Public/User Routes ===== */}
        {(!role || role === "ROLE_USER") && (
          <Route path="/" element={<UserLayout />}>
            {/* Public Pages */}
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="user/shoes" element={<Shoes />} />
            <Route path="user/shoes/:gender" element={<Shoes />} />
            <Route path="user/shoes/details/:id" element={<ShoeDetail />} />
            <Route path="user/same-category" element={<SameCategory />} />
            <Route path="user/chat-bot" element={<ChatBot />} />

            {/* User Pages */}
            <Route path="user/profile" element={<MyProfile />} />
            <Route path="user/cart" element={<Cart />} />
            <Route path="/user/wishlist" element={<Wishlist />} />
            <Route path="user/orderList" element={<OrdersList />} />
            <Route path="user/paymentForm" element={<PaymentForm />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
