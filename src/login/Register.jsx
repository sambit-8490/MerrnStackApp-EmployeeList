import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // centralized axios instance
import logo from "./logo.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await API.post("/api/users/register", {
        username,
        email,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
      setSuccess("");
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
        <h1 className="font-bold md:text-3xl text-xl mb-[30px]">Register</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* Username */}
        <div>
          <label className="block font-semibold text-sm mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full border border-gray-500 p-2 rounded-md"
            required
          />
        </div>

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

        <button className="w-full bg-red-600 p-2 rounded-md text-white">Register</button>

        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
