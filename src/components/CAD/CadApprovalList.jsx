import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";

import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Swal from 'sweetalert2';

function CadApprovalList() {
  const API_URL = window.url + "cad/getAllCads";
  const getDesignername_Url = window.url+"auth/getUsersByRoleType";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [filteredRows, setFilteredRows] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // Declare imagePreview state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designerName, setDesignerName] = useState("");
  const [designerEmail, setDesignerEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [approvedForDew, setApprovedForDew] = useState(false);
  const [approvedForCustomer, setApprovedForCustomer] = useState(false);
  const [image, setImage] = useState(null);

  const[designer_name_array,setDesigner_name_array]=useState([])

  const [selectedRowId, setSelectedRowId] = useState(null);
  const [tasksavedId, setTasksavedId] = useState(null);

  // Filters State
    const [promiseStartDate, setPromiseStartDate] = useState("");
    const [promiseEndDate, setPromiseEndDate] = useState("");
    const [completedStartDate, setCompletedStartDate] = useState("");
    const [completedEndDate, setCompletedEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });

        console.log("API Response:", response.data);
        setRows(response.data.data || []);
      } catch (err) {
        setError(`Failed to fetch Order data: ${err.message}`);
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const getDesigner_Data = async () => {
     
      try {
        const requestData = { type: "productDevelopment" };
        const response = await axios.post(getDesignername_Url, requestData, {
            headers: {
                Authorization: `Bearer ${savedToken}`,
                "Content-Type": "application/json"
            }
        });
        setDesigner_name_array(response.data.data || []);
        // console.log(materialType_array);
       
      } catch (err) {
        console.error(`Failed to fetch setting types: ${err.message}`);
      }
    };

    fetchOrders();
    getDesigner_Data();
  }, [navigate]);

  const handleApprovalChange = async (id, value) => {

     let reason = "";
      
        if (value === "Approved") {
          // Show confirmation dialog before proceeding
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do You Want To Approve This Cad?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Approve It!",
            cancelButtonText: "No, Cancel!",
          });
      
          if (!result.isConfirmed) {
            // If the user cancels, just return and do nothing
            return;
          }
        } else if (value === "Rejected") {
          // Show prompt to enter rejection reason
          const { value: inputReason } = await Swal.fire({
            title: "Reason for Rejection",
            input: "text",
            inputPlaceholder: "Enter the reason for rejection...",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
          });
      
          if (!inputReason) {
            // If no reason is entered or canceled, do nothing
            return;
          }
      
          reason = inputReason;
        }
      
    try {
      const response = await axios.put(
        window.url+"cad/updateCadStatus",
        {
          cadId: id,
          status: value,
        ...(value === "Rejected" && { reason }), // Add reason only if rejected
               },
               {
                 headers: {
                   Authorization: `Bearer ${Cookies.get("authToken")}`,
                 },
               }
             );
         
             console.log(response.data);
         
             setRows((prevRows) =>
               prevRows.map((row) =>
                 row.id === id ? { ...row, status: value, ...(value === "Rejected" && { reason }) } : row
               )
             );
              Swal.fire({
                   icon: "success",
                   title: "Approved!",
                   text: "Cad status updated successfully.",
                 });
           } catch (error) {
             console.error("Error updating order status:", error);
             Swal.fire({
                   icon: "error",
                   title: "Error!",
                   text: "Failed to update cad status. Please try again.",
                 });
           }
  };

  // const handleMoveToRender = async (id) => {
  //   try {
  //     const response = await axios.put(
  //       window.url+"cad/moveToRender",
  //       {
  //         cadId: id,
  //         isRender: true,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("authToken")}`,
  //         },
  //       }
  //     );
     
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.id === id ? { ...row, cadStatus: "render" } : row
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error moving to Render:", error);
  //   }
  // };

  const handleMoveToRender = async (id) => {
    const confirmMove = await Swal.fire({
      title: "Do you want to move to Render?",
      text: "This action will update the CAD status to Render.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Move",
      cancelButtonText: "Cancel",
    });
  
    if (!confirmMove.isConfirmed) {
      return; // Exit if the user cancels the move
    }
  
    try {
      const response = await axios.put(
        window.url + "cad/moveToRender",
        {
          cadId: id,
          isRender: true,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
  
      // Update CAD status to "render" after success
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, cadStatus: "render" } : row
        )
      );
  
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Moved to Render!",
        text: "The CAD status has been updated to Render.",
      });
  
    } catch (error) {
      console.error("Error moving to Render:", error);
  
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to move to Render. Please try again.",
      });
    }
  };
    // Filtering Logic
     useEffect(() => {
       let updatedRows = rows;
       if (promiseStartDate && promiseEndDate) {
         updatedRows = updatedRows.filter(row => row.promiseDate >= promiseStartDate && row.promiseDate <= promiseEndDate);
       }
       if (completedStartDate && completedEndDate) {
         updatedRows = updatedRows.filter(row => row.cadCompletedDate >= completedStartDate && row.cadCompletedDate <= completedEndDate);
       }
       if (statusFilter) {
         updatedRows = updatedRows.filter(row => row.status === statusFilter);
       }
       setFilteredRows(updatedRows);
     }, [promiseStartDate, promiseEndDate, completedStartDate, completedEndDate, statusFilter, rows]);
   
     const indexOfLastRow = currentPage * rowsPerPage;
     const indexOfFirstRow = indexOfLastRow - rowsPerPage;
     const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
   
     const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
     const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddDesignerClick = (rowId) => {
    setSelectedRowId(rowId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDesignerName("");
    setDesignerEmail("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];;
    setImage(file)
  };
  // const handleSubmit = async (id) => {
  //   try {
  //     const response = await axios.put(
  //       window.url+"cad/addCadDesigner",
  //       {
  //         id:id,
  //     empId: designerName,
  //     startDate: new Date(startDate).toISOString().split("T")[0], // Convert to "YYYY-MM-DD"
  //     endDate: new Date(endDate).toISOString().split("T")[0], // Convert to "YYYY-MM-DD"
  //     type: "cad"
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("authToken")}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);

  //     // setRows((prevRows) =>
  //     //   prevRows.map((row) =>
  //     //     row.id === id ? { ...row, isRender: true } : row
  //     //   )
  //     // );
  //   } catch (error) {
  //     console.error("Error moving to Render:", error);
  //     alert(
  //             "Error: " +
  //               (error.response ? JSON.stringify(error.response.data) : error.message)
  //           );
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const savedToken = Cookies.get("authToken");
  
    // Ensure token exists before making the request
    if (!savedToken) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Token Missing",
        text: "Please log in to continue.",
      });
      return;
    }
  
    // Ensure required values are provided
    if (!designerName || !startDate || !endDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields.",
      });
      return;
    }
  
    // Create the data object with properly formatted fields
    const dataToSend = {
      id: selectedRowId,
      empId: designerName,
      startDate: new Date(startDate).toISOString().split("T")[0], // Convert to "YYYY-MM-DD"
      endDate: new Date(endDate).toISOString().split("T")[0], // Convert to "YYYY-MM-DD"
      type: "cad",
    };
  
    console.log("Sending data:", dataToSend); // Debugging log
  
    try {
      const response = await axios.put(
        window.url + "cad/addCadDesigner",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      Swal.fire({
        icon: "success",
        title: "Cad Designer Created",
        text: `Cad Designer  Created`,
      });
  
     
      navigate("/cad_approval_list");
    } catch (error) {
      console.error(
        "Error creating Cad Designer:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          "Error: " +
          (error.response ? JSON.stringify(error.response.data) : error.message),
      });
    }
  };
  
  const handleImageUpload = async (e) => {
   
    e.preventDefault();
   
    const savedToken = Cookies.get("authToken");

    // Create the data object with the necessary fields (e.g., id)
  const formData = new FormData();
  // alert(parseInt(tasksavedId))
  formData.append("images", image);

  formData.append("taskId", parseInt(tasksavedId));

  

    try {
      alert("image processs")
      alert(tasksavedId)
      const response = await axios.post(
        window.url + "tasks/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Correct header for file upload
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      alert("Cad Image Saved: " + JSON.stringify(response.data));
      navigate("/cad_approval_list");
    } catch (error) {
      console.error(
        "Error creating Cad Image:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error: " +
          (error.response ? JSON.stringify(error.response.data) : error.message)
      );
    }
  };


  const handleFormAndImageUpload = async (e) => {
    // First, handle the form submission
    await handleSubmit(e);
  
    // After form submission completes, handle the image upload
    // await handleImageUpload(e);
  };

  const ViewDesignerButton = (orderId) => {
    // Implement your edit logic here
    navigate(`/cad_designer/${orderId}`);
};
  return (
    <div className="wrapper">
      <SideBar pageName="userrolePermissions" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3" style={{ wordWrap: "break-word" }}>
                CAD Approval List
              </h3>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body filter-section">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label>Promise Date (Start)</label>
                        <input type="date" className="form-control" value={promiseStartDate} onChange={(e) => setPromiseStartDate(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Promise Date (End)</label>
                        <input type="date" className="form-control" value={promiseEndDate} onChange={(e) => setPromiseEndDate(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Completed Date (Start)</label>
                        <input type="date" className="form-control" value={completedStartDate} onChange={(e) => setCompletedStartDate(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Completed Date (End)</label>
                        <input type="date" className="form-control" value={completedEndDate} onChange={(e) => setCompletedEndDate(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Status</label>
                        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="Approved">Approved</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    {loading ? (
                      <p>Loading orders...</p>
                    ) : error ? (
                      <p style={{ color: "red" }}>{error}</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="display table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th style={{ whiteSpace: "nowrap" }}>Cad ID</th>
                              <th style={{ whiteSpace: "nowrap" }}>Concept ID</th>
                              <th style={{ whiteSpace: "nowrap" }}>Req. Cad Count</th>
                              {/* <th>Image</th> */}
                              <th style={{ whiteSpace: "nowrap" }}>Promise Date</th>
                              <th>Status</th>
                              <th>Approval</th>
                              <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRows.map((row) => (
                              <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.cadNo}</td>
                                <td>{row.orderId}</td>
                                <td>{row.reqCadCount}</td>
                                {/* <td>"null"</td> */}
                                <td>{row.promiseDate}</td>
                                <td>{row.status}</td>
                                <td>
                                <select
                                  value={row.status}
                                  onChange={(e) => handleApprovalChange(row.id, e.target.value)}
                                  className="form-select"
                                  style={{ width: "150px" }} // Increased width for select box
                                  disabled={row.status === "Approved" || row.status === "Rejected"}
                                >
                                  <option value="Approved">Approved</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                                <td style={{ minWidth: "200px", whiteSpace: "pre-line" }}>
                                  <div>
                                    <button 
                                     onClick={() => handleAddDesignerClick(row.id)}
                                      className="btn btn-sm" 
                                      style={{backgroundColor:"#2E1A47",color:"white"}}
                                       // Increased width
                                    >
                                      Add Designer
                                    </button>

                                    {isModalOpen && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <div className="modal-header">
        <h5>Add Designer</h5>
        <button className="close-btn"  onClick={handleCloseModal}>
          ×
        </button>
      </div>
      <form onSubmit={handleFormAndImageUpload}>
        <div className="modal-body">
          
          <div className="row">
           
            <div className="col-md-6">
              <div className="form-group">
                <label>Designer Name</label>
                <select
                        className="form-select pd-select"
                        id="settingType"
                        value={designerName}
                       
                          // onChange={(e) => setMeterialType(e.target.value)}
                          onChange={(e) => {
                            console.log("Selected Value:", e.target.value); // Debugging
                            // alert(Make_Type)
                             
                            setDesignerName(e.target.value);
                          }}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {designer_name_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        
             
             

          
        </div>

        <div className="modal-footer">
          <button type="submit" className="btn btn-success">
            Submit
          </button>&nbsp;&nbsp;&nbsp;
          <button type="button" className="btn btn-danger" onClick={handleCloseModal}>
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
)}

<style jsx>{`
        .custom-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .custom-modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 600px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .modal-body {
          margin-top: 15px;
        }
        .form-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .form-group {
          flex: 1;
          margin-right: 10px;
        }
        .form-group:last-child {
          margin-right: 0;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        .btn-success {
          background-color: #28a745;
          color: white;
        }
        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        /* Custom Checkbox Style */
        .custom-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #007bff;
          margin-left: 10px;
        }

        .custom-checkbox:checked {
          background-color: #007bff;
          border-color: #007bff;
        }

        .custom-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
        }

        /* Image preview style */
        .image-preview-container {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          cursor: pointer;
        }

        .image-preview {
          max-width: 100%;
          max-height: 200px;
          object-fit: cover;
        }
           .swal2-container {
    z-index: 99999 !important; /* Higher than your modal's z-index */
  }
      `}</style>
                                  </div>
                                </td>
                              

                                <td style={{ minWidth: "200px", whiteSpace: "pre-line" }}>
                                  <div>
                                    <button 
                                     onClick={() =>ViewDesignerButton(row.orderId)}
                                      className="btn btn-sm" 
                                      style={{backgroundColor:"#342D7E",color:"white"}}
                                     
                                    >
                                     View Designer
                                    </button>
                                    </div>
                                    </td>
                                    <td style={{ minWidth: "200px", whiteSpace: "pre-line" }} >
                                  {/* <button
                                    onClick={() => handleMoveToRender(row.id)}
                                    disabled={row.isRender === true || row.status !== "Approved"}
                                    className={`btn btn-sm ${row.cadStatus != "cad" ? "btn-secondary" : row.status === "Approved" ? "btn-success" : "btn-secondary"}`}
                                    style={{ width: "150px" }} // Increased width
                                  >
                                    {row.cadStatus != "cad" ? "Moved to Render" : "Move to Render"}
                                  </button> */}

                                  <button 
                                    onClick={() => handleMoveToRender(row.id)} 
                                    disabled={row.cadStatus !== "cad" || row.status !== "Approved"} 
                                    className={`btn btn-sm ${row.cadStatus !== "cad" ? "btn-secondary" : row.status === "Approved" ? "btn-success" : "btn-secondary"}`}
                                    
                                  >
                                    {row.cadStatus !== "cad" ? "Moved to Render" : "Move to Render"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div
                      className="w-full flex justify-end pr-4"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div className="pagination flex space-x-2 mt-4">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === 1
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-500 text-white hover:bg-gray-600"
                          }`}
                        >
                          <FaChevronLeft />
                        </button>

                        {[...Array(totalPages).keys()].map((num) => (
                          <button
                            key={num}
                            onClick={() => paginate(num + 1)}
                            className={`px-3 py-1 border rounded-md ${
                              currentPage === num + 1
                                ? "bg-gray-600 text-white"
                                : "bg-gray-300"
                            }`}
                          >
                            {num + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === totalPages
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-500 text-white hover:bg-gray-600"
                          }`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default CadApprovalList;
