import React, { useState, useEffect } from 'react';
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate, useParams } from "react-router"; // useParams to get the customerId from URL
import Cookies from 'js-cookie';

function EditCustomer() {
    const { customerId } = useParams(); // Get customerId from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // Separate useState for each form field
    const [customerUsername, setCustomerUsername] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerFirstName, setCustomerFirstName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [customerCountry, setCustomerCountry] = useState("");

    const [country_subsidiary, setCountry_subsidiary] = useState("");
    const [customer_fax, setCustomer_fax] = useState("");
    const [ customer_type, setCustomer_type] = useState("");
    


    const [errors, setErrors] = useState({});
    
    const validateForm = () => {
        let newErrors = {};
        if (!customerFirstName.trim()) newErrors.customer_first_name = "First Name is required";
        if (!customerLastName.trim()) newErrors.customer_last_name = "Last Name is required";
        if (!customerUsername.trim()) newErrors.customer_username = "Username is required";
        if (!customer_type.trim()) newErrors.customer_type = "Customer Type is required";
        if (!customer_fax.trim()) newErrors.customer_fax= "Customer Fax is required";
        if (!country_subsidiary.trim()) newErrors.country_subsidiary = "Country Subsidiary is required";
        if (!customerEmail.trim()) {
            newErrors.customer_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            newErrors.customer_email = "Invalid email format";
        }
        if (!phoneNumber.trim()) {
            newErrors.phone_number = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phone_number = "Phone number must be 10 digits";
        }
        if (!pincode.trim()) {
            newErrors.pincode = "Pin Code is required";
        } else if (pincode.length !== 6) {
            newErrors.pincode = "Pin Code must be 6 digits";
        }
        if (!customerCountry.trim()) newErrors.customer_country = "Country is required";
        if (!address.trim()) newErrors.address = "Address is required";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
 const API_URL = window.url+`customer/${customerId}`
    useEffect(() => {
    const savedToken = Cookies.get("authToken");

    if (!savedToken) {
        navigate("/"); // Redirect if no token
        return;
    }

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${savedToken}`,
                },
            });
            const customerData = response.data.data || {};
            setCustomerUsername(customerData.customer_username || "");
            setCustomerEmail(customerData.customer_email || "");
            setCustomerFirstName(customerData.customer_first_name || "");
            setCustomerLastName(customerData.customer_last_name || "");
            setPhoneNumber(customerData.phone_number || "");
            setAddress(customerData.address || "");
            setPincode(customerData.pincode || "");
            setCustomerCountry(customerData.customer_country || "");

            setCountry_subsidiary(customerData.country_subsidiary || "");
            setCustomer_type(customerData.customer_type || "");
           setCustomer_fax(customerData.customer_fax || "");
        } catch (err) {
            setError("Failed to fetch customer data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchCustomers();
}, [navigate]);
    
    const handleSubmit = async (e) => {
        alert(address)
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const savedToken = Cookies.get("authToken");

            if (!savedToken) {
                alert("Authorization token not found.");
                return;
            }

            const response = await axios.put(
               
                 window.url+`customer/editCustomer/${customerId}`, // Use PUT for updating
                {
                    customer_username: customerUsername,
                    customer_email: customerEmail,
                    customer_first_name: customerFirstName,
                    customer_last_name: customerLastName,
                    phone_number: phoneNumber,
                    address: address,
                    pincode: pincode,
                    customer_country: customerCountry,

                    customer_fax:customer_fax,
                    customer_type:customer_type,
                    country_subsidiary:country_subsidiary
                },
                {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Customer Updated: " + JSON.stringify(response.data));
            navigate("/customer__list");
        } catch (error) {
            if (error.response) {
                console.error("Error Response:", error.response.data);
                alert("Error updating customer: " + (error.response ? JSON.stringify(error.response.data) : error.message));
            } else {
                console.error("Error Message:", error.message);
                alert("Error updating customer.");
            }
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
            <ul className="breadcrumbs mb-3">
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
            </ul>
          </div>

          <div className="card">
            <div className="card-header  text-white">
            <center><h5 style={{color:"black"}}>Edit Customer</h5></center>  
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
                                value={customerFirstName}
                                onChange={(e) => setCustomerFirstName(e.target.value)}
                                required
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
                                value={customerLastName}
                                onChange={(e) => setCustomerLastName(e.target.value)}
                                required
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
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                required
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
                                value={customerUsername}
                                onChange={(e) => setCustomerUsername(e.target.value)}
                                required
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
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
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
                                value={customerCountry}
                                onChange={(e) => setCustomerCountry(e.target.value)}
                                required
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
                        value={customer_fax}
                        onChange={(e) => setCustomer_fax(e.target.value)}
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
                        value={customer_type}
                        onChange={(e) => setCustomer_type(e.target.value)}
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
                        value={country_subsidiary}
                        onChange={(e) => setCountry_subsidiary(e.target.value)}
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
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
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
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
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
  )
}

export default EditCustomer