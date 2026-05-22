import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import logo from "./logo1.png";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      navigate("/login");
      return;
    }

    API.get(`/api/users/user/${email}`)
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        handleLogout();
      });
  }, [navigate]);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="w-full h-[10vh] bg-black text-white px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-14">
        {/* Logo */}
        <Link to="/home" className="flex items-center text-2xl md:text-4xl font-bold">
          <img src={logo} alt="DealsDray Logo" className="w-8 md:w-12" />
          DealsDray
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex text-xl gap-10 items-center">
          <Link to="/home" className="hover:text-red-600">Home</Link>
          <Link to="/employee_list" className="hover:text-red-600">Employee List</Link>
        </div>
      </div>

      {/* Desktop Logout */}
      <div className="hidden md:flex text-xl items-center">
        {user && <span className="mr-3 text-red-600">~ {user.username}</span>}
        <span className="text-red-600">|</span>
        <button onClick={handleLogout} className="ml-4 hover:text-red-600">
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={handleMenuToggle}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16m-7 6h7"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[10vh] left-0 w-full bg-black flex flex-col items-center gap-6 py-4">
          <Link to="/home" onClick={handleMenuToggle}>Home</Link>
          <Link to="/employee_list" onClick={handleMenuToggle}>Employee List</Link>
          <button onClick={handleLogout} className="text-red-600">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
