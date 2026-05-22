import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import logo from "./logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    try {
      const response = await API.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);

      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="h-[100vh] w-[100%] flex flex-col md:flex-row justify-center items-center md:gap-32 gap-10">
      <div>
        <div className="flex flex-col items-center md:text-2xl text-xl gap-2 font-bold">
          <img src={logo} alt="DealsDray" className="md:w-[100px] w-[70px]" />
          DealsDray
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="md:w-[400px] w-[80%] shadow-lg shadow-red-300 rounded-lg p-[20px] space-y-6"
      >
        <h1 className="font-bold md:text-3xl text-2xl mb-[30px]">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* Email */}
        <div>
          <label className="block font-semibold text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="youremail@example.com"
            className="w-full border border-gray-500 p-2 rounded-md"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-500 p-2 rounded-md"
            required
          />
        </div>

        <button className="w-full bg-red-600 p-2 rounded-md text-white">
          Login
        </button>

        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-black font-semibold">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
