import React, { useState, useEffect } from "react";
import Nav from "../home/Nav";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreateEmployee = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "HR",
    gender: "",
    course: [],
    image: null,
  });

  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value]
          : prev.course.filter((c) => c !== value),
      }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const validateForm = () => {
    let formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email || !emailRegex.test(formData.email))
      formErrors.email = "Valid email is required";
    if (!formData.mobile || isNaN(formData.mobile) || formData.mobile.length !== 10)
      formErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.gender) formErrors.gender = "Gender is required";
    if (formData.course.length === 0)
      formErrors.course = "Select at least one course";
    if (!formData.image)
      formErrors.image = "Image is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "course") {
        formData.course.forEach((c) => payload.append("course[]", c));
      } else {
        payload.append(key, formData[key]);
      }
    });

    try {
      const res = await API.post("/api/employees", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Employee created successfully");
        navigate("/employee_list");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating employee");
    }
  };

  return (
    <div>
      <Nav />
      <section className="w-[90%] h-[80vh] mx-auto mt-8 flex flex-col items-center">
        <div className="md:w-[50%] w-[80%] flex items-center">
          <Link
            to="/employee_list"
            className="bg-gray-800 h-8 rounded-md px-2 text-white"
          >
            Back
          </Link>
          <h1 className="text-xl md:text-3xl font-bold ml-[30%]">
            Create Employee
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-[50%] w-[80%] shadow-lg shadow-red-300 rounded-lg p-5 space-y-4 overflow-auto"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          {/* Mobile */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}

          {/* Designation */}
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>

          {/* Gender */}
          <div className="flex gap-4">
            <label><input type="radio" name="gender" value="male" onChange={handleChange} /> Male</label>
            <label><input type="radio" name="gender" value="female" onChange={handleChange} /> Female</label>
          </div>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}

          {/* Course */}
          <div className="flex gap-4">
            <label><input type="checkbox" value="mca" onChange={handleChange} /> MCA</label>
            <label><input type="checkbox" value="bca" onChange={handleChange} /> BCA</label>
            <label><input type="checkbox" value="bsc" onChange={handleChange} /> BSC</label>
          </div>
          {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}

          {/* Image */}
          <input type="file" accept=".jpg,.png,.jpeg" onChange={handleChange} />
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}

          <button className="w-full bg-red-600 text-white p-2 rounded">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default CreateEmployee;
