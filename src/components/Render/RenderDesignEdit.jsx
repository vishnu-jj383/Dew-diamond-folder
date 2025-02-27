import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
function RenderDesignEdit() {
    const { designerId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [taskId, setTaskId] = useState("");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageUrls, setImageUrls] = useState("");
    
     const [approvedForDew, setApprovedForDew] = useState(false);
      const [approvedForCustomer, setApprovedForCustomer] = useState(false);
    // const [specialInstruction, setSpecialInstruction] = useState("");

    const API_URL =  window.url+`tasks/getTaskById/${designerId}`;

    useEffect(() => {
        
        const savedToken = Cookies.get("authToken");

        if (!savedToken) {
            navigate("/");
            return;
        }

        const fetchCustomers = async () => {
            // try {
                // const requestData = { orderId: orderId ,type:"cad"};
                // const response = await axios.post(API_URL, requestData, {
                //     headers: {
                //         Authorization: `Bearer ${savedToken}`,
                //         "Content-Type": "application/json"
                //     }
                // });
                try {
                    const response = await axios.get(API_URL, {
                        headers: {
                            Authorization: `Bearer ${savedToken}`,
                        },
                    });

                const customerData = response.data.data || {};
               
                setTaskId(customerData.taskId || "");
                setName(customerData.Employee.name || "");
                setStartDate(customerData.startDate || "");
                setEndDate(customerData.endDate || "");
                setImageUrls(customerData.imageUrls || "");
               

            } catch (err) {
                setError("Failed to fetch customer data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [navigate, designerId]); // Added customerId dependency

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const savedToken = Cookies.get("authToken");

            if (!savedToken) {
                alert("Authorization token not found.");
                return;
            }

            const response = await axios.put(
                 window.url+`cad/updateCad/${designerId}`,
                {
                    taskId,
                    name,
                    startDate,
                    endDate,
                    imageUrls,
                    
                },
                {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Cad Updated: " + JSON.stringify(response.data));
            navigate("/cadlist");
        } catch (error) {
            if (error.response) {
                console.error("Error Response:", error.response.data);
                alert("Error updating customer: " + JSON.stringify(error.response.data));
            } else {
                console.error("Error Message:", error.message);
                alert("Error updating customer.");
            }
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];;
        setImageUrls(file)
      };

      const handleImageUpload = async (e) => {
        e.preventDefault();
      
        const savedToken = Cookies.get("authToken");
      
        // Create the data object with the necessary fields (e.g., id)
        const formData = new FormData();
        // alert(parseInt(tasksavedId))
        formData.append("images", imageUrls);
        formData.append("taskId", designerId);
      
        try {
          // Show a loading alert or initial message
          Swal.fire({
            icon: "info",
            title: "Processing Image...",
            text: "Your image is being uploaded, please wait.",
            showConfirmButton: false,
            allowOutsideClick: false, // Prevent closing the modal until action is complete
          });
      
          const response = await axios.post(window.url + "tasks/uploadImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Correct header for file upload
              Authorization: `Bearer ${savedToken}`,
            },
          });
      
          // Close the info alert once the process is complete
          Swal.close();
      
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Image Saved",
            text: "Render image has been saved successfully.",
          });
      
          // Navigate to the desired page after successful image upload
           navigate("/cad_approval_list");
        //  navigate(`/render_designer_edit/${designerId}`);
        } catch (error) {
          // Close the info alert if there is an error
          Swal.close();
      
          console.error("Error uploading image:", error.response ? error.response.data : error.message);
      
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "Error: " +
              (error.response ? JSON.stringify(error.response.data) : error.message),
          });
        }
      };
      const CustomerApprove = async (e) => {
        e.preventDefault();
      
        const savedToken = Cookies.get("authToken");
      
        // Ensure token exists before making the request
        if (!savedToken) {
          Swal.fire({
            icon: "error",
            title: "Authentication Failed",
            text: "Authentication token not found. Please log in.",
          });
          return;
        }
      
        // Create the data object with properly formatted fields
        const dataToSend = {
          taskId: designerId,
          isApproved: true,
        };
      
        console.log("Sending data:", dataToSend); // Debugging log
      
        try {
          const response = await axios.post(
            window.url + "tasks/customerApprove",
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${savedToken}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Design Approved",
            text: "The design has been successfully approved for the customer.",
          });
      
          // Redirect after saving
           navigate("/renderApproval__list");
        //   navigate(`/render_designer_edit/${designerId}`);
        } catch (error) {
          console.error(
            "Error approving design:",
            error.response ? error.response.data : error.message
          );
      
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "Error: " +
              (error.response ? JSON.stringify(error.response.data) : error.message),
          });
        }
      };
      const DewApprove = async (e) => {
        e.preventDefault();
      
        const savedToken = Cookies.get("authToken");
      
        // Ensure token exists before making the request
        if (!savedToken) {
          Swal.fire({
            icon: "error",
            title: "Authentication Failed",
            text: "Authentication token not found. Please log in.",
          });
          return;
        }
      
        // Create the data object with properly formatted fields
        const dataToSend = {
          taskId: designerId,
          isApproved: true,
        };
      
        console.log("Sending data:", dataToSend); // Debugging log
      
        try {
          const response = await axios.post(
            window.url + "tasks/ownApprove",
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${savedToken}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          // Show success alert
          Swal.fire({
            icon: "success",
            title: "Design Approved",
            text: "The design has been successfully approved for dew.",
          });
      
          // Redirect after saving
        //   navigate(`/render_designer_edit/${designerId}`);
          navigate("/renderApproval__list");
        } catch (error) {
          console.error(
            "Error approving design:",
            error.response ? error.response.data : error.message
          );
      
          // Show error alert
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "Error: " +
              (error.response ? JSON.stringify(error.response.data) : error.message),
          });
        }
      };

    const handleFormAndImageUpload = async (e) => {
        // First, handle the form submission
        await handleImageUpload(e);
      
        // After form submission completes, handle the image upload
        await CustomerApprove(e);
        await DewApprove(e);
      };

  return (
    <div className="wrapper">
      {/* Sidebar */}
      <SideBar />

      {/* Main Panel */}
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              {/* <h3 className="fw-bold mb-3">CAD Edit</h3> */}
              <ul className="breadcrumbs mb-3">
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a>Upload Image</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  {/* <a href="/cad_metal">Metal & Material</a> */}
                  <a href={`/cad_metal/${designerId}`}>Metal & Material</a>
                </li>
              </ul>
            </div>

            {/* Order Form */}
            <div className="card">
            <div className="card-header  text-white">
            <center><h5 style={{color:"black"}}>Designer Edit</h5></center>  
            </div>
            <div className="card-body">
            <div className="row">
              {/* Customer Selection */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="customerSelect">taskId</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="emailInput"
                    value={taskId}
                    onChange={(e) => setTaskId(e.target.value)}
                    placeholder="Enter taskId"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="emailInput">Name</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="emailInput"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter OrderId"
                  />
                </div>
              </div>
            </div>

           

            <div className="row">
              {/* Date Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dateInput">Start Date</label>
                  <input
                    
                    type="datetime-local" 
                    className="form-control"
                    id="dateInput"
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Enter Promise Date"
                  />
                </div>
              </div>

              {/* Promised Date Input */}
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="promisedDateInput">End Date</label>
                  <input
                    type="datetime-local" 
                    className="form-control"
                    id="promisedDateInput"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Enter Cad Completed Date"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
            <input
                      type="file"
                      accept="image/*" // Limit file types to images
                      onChange={handleFileChange} // Handle the file change event
                    />
            </div>
            
            {/* Action Buttons */}
              <br></br>
              <div className="row">
            <div className="col-md-6">
              
              <input
                type="checkbox"
                checked={approvedForDew}
                onChange={(e) => setApprovedForDew(e.target.checked)}
                className="custom-checkbox"
              />&nbsp;&nbsp;&nbsp;
              <label>Approved for Dew</label>
            </div>
            <div className="col-md-6">
             
              <input
                type="checkbox"
                checked={approvedForCustomer}
                onChange={(e) => setApprovedForCustomer(e.target.checked)}
                className="custom-checkbox"
              />&nbsp;&nbsp;&nbsp;
               <label>Approved for Customer</label>
            </div>
          </div>
        </div>
            <div className="card-action">
              <center>
              <button className="btn" style={{backgroundColor:"#2E1A47",color:"white"}} onClick={handleFormAndImageUpload}>Submit</button> &nbsp;&nbsp;&nbsp;
              <button className="btn btn-danger">Cancel</button>
              </center>
            
            </div>
            </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    
  );
};
export default RenderDesignEdit
