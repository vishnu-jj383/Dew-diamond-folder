import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
function EditSkitch() {
    const { id } = useParams();
  const navigate = useNavigate();
const [error, setError] = useState(null);
const[sketchNo,setSketchNo]=useState("")
const[orderId,setorderId]=useState("")
  const [sketchBriefDate, setSketchBriefDate] = useState('');
  const [sketchCompletedDate, setSketchCompletedDate] = useState('');
  const [promiseDate, setPromiseDate] = useState('');
  const [reqSketchCount, setReqSketchCount] = useState('');
  const [selectedSketchCount, setSelectedSketchCount] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)

  // const steps = [
  //   { label: "Sketch", icon: <Person />, path: `/edit/${id}` },
  //   { label: "Special Instruction", icon: <Comment />, path: "/instruction" },
  //   { label: "Upload Images", icon: <Image />, path: "/editimg" },
  // ];
  
  const currentStep = `/edit/${id}`;

  
  const API_URL = window.url+`sketch/getSketch/${id}`
useEffect(() => {
    const savedToken = Cookies.get("authToken");

    if (!savedToken) {
        navigate("/"); // Redirect if no token
        return;
    }

    const fetchCustomers = async () => {
      setLoading(true); // Add this line
      try {
          const response = await axios.get(API_URL, {
              headers: {
                  Authorization: `Bearer ${savedToken}`,
              },
          });
          const customerData = response.data.data || {};
          setSketchNo(customerData.sketchNo || "")
          setorderId(customerData.orderId || "")
          setSketchBriefDate(customerData.sketchBriefDate || "");
          setSketchCompletedDate(customerData.sketchCompletedDate || "");
          setPromiseDate(customerData.promiseDate || "");
          setReqSketchCount(customerData.reqSketchCount || "");
          setSelectedSketchCount(customerData.selectedSketchCount || "");
          setSpecialInstructions(customerData.specialInstructions || "");
      } catch (err) {
          setError("Failed to fetch customer data.");
          console.error(err);
      } finally {
          setLoading(false);
      }
  };
  fetchCustomers()
}, [id,navigate]);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      console.log('Edited Data:', {
        sketchBriefDate,
        sketchCompletedDate,
        promiseDate,
        reqSketchCount,
        selectedSketchCount,
        specialInstructions,
      });
      setLoading(false);
      navigate("/skitch-list");
    }, 1500);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const savedToken = Cookies.get("authToken");

        if (!savedToken) {
            alert("Authorization token not found.");
            return;
        }

        const response = await axios.put(
             window.url+`sketch/editSketch/${id}`, // Use PUT for updating
            {
              orderId:orderId,
              sketchNo:sketchNo,
              sketchBriefDate:sketchBriefDate,
              sketchCompletedDate:sketchCompletedDate,
              promiseDate: promiseDate,
              reqSketchCount:reqSketchCount,
              selectedSketchCount:selectedSketchCount,
              specialInstructions:specialInstructions,
            },
            {
                headers: {
                    Authorization: `Bearer ${savedToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        alert("Customer Updated: " + JSON.stringify(response.data));
        navigate("/skichlist");
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
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Panel */}
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Sketch Edit</h3>
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

            {/* Order Form */}
            <div className="row">
              {/* Customer Selection */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="customerSelect">Sketch Number</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="emailInput"
                    value={sketchNo} 
                    onChange={(e) => setSketchNo(e.target.value)}
                    placeholder="Enter Sketch Number"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="emailInput">OrderId</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="emailInput"
                    value={orderId} 
                    onChange={(e) => setorderId(e.target.value)}
                    placeholder="Enter OrderId"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              {/* Mobile Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="mobileInput">Sketch Brief Date</label>
                  <input
                    
                    type="datetime-local" 
                    className="form-control"
                    id="mobileInput"
                    value={sketchBriefDate} 
                    onChange={(e) => setSketchBriefDate(e.target.value)}
                    placeholder="Enter Sketch Brief Date"
                  />
                </div>
              </div>

              {/* Customer Code Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="customerCodeInput">Sketch Completed Date</label>
                  <input
                  
                    type="datetime-local" 
                    className="form-control"
                    id="customerCodeInput"
                    value={sketchCompletedDate} 
                    onChange={(e) => setSketchCompletedDate(e.target.value)}
                    placeholder="Enter Sketch Completed Date"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              {/* Date Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dateInput">Promise Date</label>
                  <input
                    
                    type="datetime-local" 
                    className="form-control"
                    id="dateInput"
                    value={promiseDate} 
                    onChange={(e) => setPromiseDate(e.target.value)}
                    placeholder="Enter Promise Date"
                  />
                </div>
              </div>

              {/* Promised Date Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="promisedDateInput">Requested Sketch Count</label>
                  <input
                    type="text"
                    className="form-control"
                    id="promisedDateInput"
                    value={reqSketchCount} 
                    onChange={(e) => setReqSketchCount(e.target.value)}
                    placeholder="Enter Requested Sketch Count"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              {/* Date Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dateInput">Selected Sketch Count</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dateInput"
                    value={selectedSketchCount} 
                    onChange={(e) => setSelectedSketchCount(e.target.value)}
                    placeholder="Enter Selected Sketch Count"
                  />
                </div>
              </div>

              {/* Promised Date Input */}
              <div className="col-md-6">
              <div className="form-group">
                  <label htmlFor="customerSelect">Special Instructions</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dateInput"
                    value={specialInstructions} 
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Enter Selected Sketch Count"
                  />
                </div>
              </div>
            </div>

           

          
           

            

            
            {/* Action Buttons */}
              <br></br>
            <div className="card-action">
              <center>
              <button className="btn btn-success" onClick={handleSubmit}>Submit</button> &nbsp;&nbsp;&nbsp;
              <button className="btn btn-danger">Cancel</button>
              </center>
            
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
export default EditSkitch