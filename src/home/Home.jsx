import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

const Home = () => {
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Nav />

      <section className="h-[90vh] flex justify-center items-center bg-gray-100">
        <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 animate-bounce">
          <span className="text-red-500">Welcome to</span> Admin Panel
        </h1>
      </section>
    </div>
  );
};

export default Home;
