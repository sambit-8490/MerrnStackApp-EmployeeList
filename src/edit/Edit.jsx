import React, { useEffect, useState } from "react";
import Nav from "../home/Nav";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [imageChange, setImageChange] = useState(false);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Fetch employee
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await API.get(`/api/employees/${id}`);
        setFormData({
          ...res.data,
          image: null, // reset image field
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchEmployee();
  }, [id]);

  // Handle input
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
      setImageChange(true);
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const validateForm = () => {
    let formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      formErrors.email = "Valid email required";
    if (!formData.mobile || isNaN(formData.mobile) || formData.mobile.length !== 10)
      formErrors.mobile = "Valid 10-digit mobile required";
    if (!formData.gender) formErrors.gender = "Gender required";
    if (formData.course.length === 0)
      formErrors.course = "Select at least one course";

    if (
      imageChange &&
      !["image/jpeg", "image/png", "image/jpg"].includes(formData.image?.type)
    ) {
      formErrors.image = "Only jpg, jpeg, png allowed";
    }

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
      } else if (formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    });

    try {
      const res = await API.put(`/api/employees/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Employee updated successfully");
        navigate("/employee_list");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
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
          <h1 className="text-2xl md:text-3xl font-bold ml-[30%]">
            Edit Details
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-[50%] w-[80%] shadow-lg shadow-red-300 rounded-lg p-5 space-y-4 overflow-auto"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Name"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Mobile"
          />
          {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}

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

          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              /> Female
            </label>
          </div>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}

          <div className="flex gap-4">
            <label>
              <input
                type="checkbox"
                value="mca"
                checked={formData.course.includes("mca")}
                onChange={handleChange}
              /> MCA
            </label>
            <label>
              <input
                type="checkbox"
                value="bca"
                checked={formData.course.includes("bca")}
                onChange={handleChange}
              /> BCA
            </label>
            <label>
              <input
                type="checkbox"
                value="bsc"
                checked={formData.course.includes("bsc")}
                onChange={handleChange}
              /> BSC
            </label>
          </div>
          {errors.course && <p className="text-red-500 text-xs">{errors.course}</p>}

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
          />
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}

          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      </section>
    </div>
  );
};

export default Edit;
