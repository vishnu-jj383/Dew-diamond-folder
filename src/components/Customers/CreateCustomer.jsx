import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function CreateCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_username: "",
    customer_email: "",
    customer_first_name: "",
    customer_last_name: "",
    phone_number: "",
    address: "",
    pincode: "",
    customer_country: "",
    country_subsidiary:"",
    customer_fax:"",
    customer_type:"",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.customer_first_name.trim()) newErrors.customer_first_name = "First Name is required";
    if (!formData.customer_last_name.trim()) newErrors.customer_last_name = "Last Name is required";
    if (!formData.customer_username.trim()) newErrors.customer_username = "Username is required";
    if (!formData.customer_type.trim()) newErrors.customer_type = "Customer Type is required";
    if (!formData.customer_fax.trim()) newErrors.customer_fax= "Customer Fax is required";
    if (!formData.country_subsidiary.trim()) newErrors.country_subsidiary = "Country Subsidiary is required";
    
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Invalid email format";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be 10 digits";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pin Code is required";
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = "Pin Code must be 6 digits";
    }
    if (!formData.customer_country.trim()) newErrors.customer_country = "Country is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const savedToken = Cookies.get("authToken");

    if (!savedToken) {
      navigate("/"); // Redirect if no token
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const savedToken = Cookies.get("authToken");

    console.log("Sending data:", formData); // Debugging log

    try {
      const response = await axios.post(
         window.url+"customer/addCustomer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Customer Created: " + JSON.stringify(response.data));
      navigate("/customer__list");
    } catch (error) {
      console.error(
        "Error creating customer:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error: " +
          (error.response ? JSON.stringify(error.response.data) : error.message)
      );
    }
  };

  return (
    <div className="wrapper">
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              {/* <h3 className="fw-bold mb-3">Create Customer</h3> */}
              {/* <ul className="breadcrumbs mb-3">
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a>PD/Concept</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a href="#">Create Order</a>
                </li>
              </ul> */}
            </div>

            <div className="card">
              <div className="card-header  text-white">
              <center><h5 style={{color:"black"}}>Create Customer</h5></center>  
              </div>
              <div className="card-body">
                <div className="row">
                 

                  

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                    
                        type="text"
                        className="form-control"
                        name="customer_first_name"
                        onChange={handleChange}
                        placeholder="Enter First Name"
                      />
                       {errors.customer_first_name && <span className="text-danger">{errors.customer_first_name}</span>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_last_name"
                        onChange={handleChange}
                        placeholder="Enter Last Name"
                      />
                        {errors.customer_last_name && <span className="text-danger">{errors.customer_last_name}</span>}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_email"
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                        {errors.customer_email && <span className="text-danger">{errors.customer_email}</span>}
                    </div>
                  </div>
                </div>

                <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_username"
                        onChange={handleChange}
                        placeholder="Enter Username"
                      />
                        {errors.customer_username && <span className="text-danger">{errors.customer_username}</span>}
                    </div>
                  </div>
                 

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="phone">Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone_number"
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                      />
                      {errors.phone_number && <span className="text-danger">{errors.phone_number}</span>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_country"
                        onChange={handleChange}
                        placeholder="Enter Country"
                      />
                       {errors.customer_country && <span className="text-danger">{errors.customer_country}</span>}
                    </div>
                  </div>
                </div>

                

                <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="username">Customer Fax</label>
                      <input
                        type="number"
                        className="form-control"
                        name="customer_fax"
                        onChange={handleChange}
                        placeholder="Enter Customer Fax"
                      />
                        {errors.customer_fax && <span className="text-danger">{errors.customer_fax}</span>}
                    </div>
                  </div>
                 

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="phone">Customer Type</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customer_type"
                        onChange={handleChange}
                        placeholder="Enter Customer Type"
                      />
                      {errors.customer_type && <span className="text-danger">{errors.customer_type}</span>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="country">Country Subsidiary</label>
                      <input
                        type="text"
                        className="form-control"
                        name="country_subsidiary"
                        onChange={handleChange}
                        placeholder="Enter Country Subsidiary"
                      />
                       {errors.country_subsidiary && <span className="text-danger">{errors.country_subsidiary}</span>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="pincode">Pin Code</label>
                      <input
                        type="number"
                        className="form-control"
                        name="pincode"
                        onChange={handleChange}
                        placeholder="Enter Pincode"
                      />
                        {errors.pincode && <span className="text-danger">{errors.pincode}</span>}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        onChange={handleChange}
                        placeholder="Enter Address"
                      />
                      {errors.address && <span className="text-danger">{errors.address}</span>}
                    </div>
                  </div>
                </div>


                <br />
                <center>
                  <div className="card-action">
                    <button className="btn " style={{backgroundColor:"#2E1A47",color:"white"}} onClick={handleSubmit}>
                      Submit
                    </button>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-danger">Cancel</button>
                  </div>
                </center>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default CreateCustomer;
