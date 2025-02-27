import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';

import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from 'js-cookie';
import {
    FaEdit,
    FaTrash,
    FaEllipsisV,
    FaChevronLeft,
    FaChevronRight,
  } from "react-icons/fa";
  import { useSelector } from "react-redux";
  import Swal from 'sweetalert2';
function RenderApprovalList() {
    const [rows, setRows] = useState([]);
    const [render_imagerows, setRender_image_Rows] = useState([]);
        const [filteredRows, setFilteredRows] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [activeRowId, setActiveRowId] = useState(null);
        const [currentPage, setCurrentPage] = useState(1);
        const rowsPerPage = 5;

          const [isModalOpen, setIsModalOpen] = useState(false);
        const navigate = useNavigate();
       const sideBarState = useSelector(state => state?.sidebar?.sideBar)

       const [designerName, setDesignerName] = useState("");
         const [designerEmail, setDesignerEmail] = useState("");
         const [startDate, setStartDate] = useState("");
         const [endDate, setEndDate] = useState("");
         const [approvedForDew, setApprovedForDew] = useState(false);
         const [approvedForCustomer, setApprovedForCustomer] = useState(false);
      
       
         const[designer_name_array,setDesigner_name_array]=useState([])
         const [selectedRowId, setSelectedRowId] = useState(null);
        // Filters State
        const [promiseStartDate, setPromiseStartDate] = useState("");
        const [promiseEndDate, setPromiseEndDate] = useState("");
        const [completedStartDate, setCompletedStartDate] = useState("");
        const [completedEndDate, setCompletedEndDate] = useState("");
        const [statusFilter, setStatusFilter] = useState("");

  const getrender_API_URL =  window.url+"tasks/getTasksByOrderIdOrType";



//   const handleApprovalChange = async (id, value) => {
//     const row = rows.find(row => row.id === id);
//     const getDesignerdata = async () => {
//         setLoading(true);
//         try {
//             const requestData = { orderId: row.orderId, type: "render" };
//             const response = await axios.post(getrender_API_URL, requestData, {
//                 headers: {
//                     Authorization: `Bearer ${savedToken}`,
//                     "Content-Type": "application/json",
//                 }
//             });

//             console.log("API Response:", response.data); 

//             if (response.data && response.data.tasks && Array.isArray(response.data.tasks)) {
//                 const designer = response.data.tasks[0];

//                 // Check if the image field is empty or null
//                 if (!designer.imageUrls || designer.imageUrls.length === 0) {
//                     Swal.fire({
//                         icon: 'warning',
//                         title: 'Image Required',
//                         text: 'Designer image is missing. Please upload an image.',
//                         confirmButtonColor: '#3085d6',
//                         confirmButtonText: 'OK',
//                     });
//                     return false; // Return false if the image is missing
//                 }

//                 setRender_image_Rows(response.data.tasks); 
//                 return true; 
//             } else {
//                 console.error("Unexpected API response format:", response.data);
//                 setError("Invalid API response format.");
//                 return false; 
//             }
//         } catch (err) {
//             console.error("API Fetch Error:", err);
//             setError(`Failed to fetch Order data: ${err.message}`);
//             return false; 
//         } finally {
//             setLoading(false);
//         }
//     };

    
//     const imageValid = await getDesignerdata();
//     if (!imageValid) {
//         return; 
//     }

    
//     try {
//         const response = await axios.put(
//             window.url + "render/updateRenderStatus",
//             {
//                 renderId: id,
//                 status: value,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${Cookies.get("authToken")}`,
//                 },
//             }
//         );

//         console.log(response.data); // Log response from server

//         setRows((prevRows) =>
//             prevRows.map((row) =>
//                 row.id === id ? { ...row, status: value } : row
//             )
//         );
//     } catch (error) {
//         console.error("Error updating order status:", error);
//     }
// };

const handleApprovalChange = async (id, value) => {
  const row = rows.find((row) => row.id === id);

  // Show confirmation alert before proceeding with approval
  const confirmApproval = await Swal.fire({
    title: "Do You Want To Approve The Render?",
    text: "This action will update the render status.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "Cancel",
  });

  if (!confirmApproval.isConfirmed) {
    return; // Exit if the user cancels the approval
  }

  try {
    const response = await axios.put(
      window.url + "render/updateRenderStatus",
      {
        renderId: id,
        status: value,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      }
    );

    console.log(response.data); // Log response from server

    // Update state after successful approval
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, status: value } : row
      )
    );

    Swal.fire({
      icon: "success",
      title: "Approved!",
      text: "Render status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Failed to update render status. Please try again.",
    });
  }
};
        


const handleMoveToDesign = async (id) => {
  const confirmMove = await Swal.fire({
    title: "Do you want to move to Design?",
    text: "This action will update the render status.",
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
      window.url + "render/updateRenderStatusToDesign",
      { renderId: id },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      }
    );

    console.log(response.data); // Log response from server

    // Check if the response contains the message "No images found in render"
    if (response.data && response.data.message === "No images found in render") {
      Swal.fire({
        icon: "warning",
        title: "No Images Found!",
        text: "No images were found in the render. Please check and try again.",
      });
    } else {
      // If no warning, update the render status to "design"
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, renderStatus: "design" } : row
        )
      );
      Swal.fire({
        icon: "success",
        title: "Moved Successfully!",
        text: "Render status updated to design.",
      });
    }
  } catch (error) {
    // Check if the error contains the "No images found in render" message
    if (error.response && error.response.data && error.response.data.message === "No images found in render") {
      Swal.fire({
        icon: "warning",
        title: "No Images Found!",
        text: "No images were found in the render. Please check and try again.",
      });
    } else {
      // Handle other actual errors (e.g., network issues, server failure)
      console.error("Error moving to Design:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
      });
    }
  }
};




const API_URL =  window.url+"render/getAllRenders";
const getDesignername_Url = window.url+"auth/getUsersByRoleType";

    useEffect(() => {
            const savedToken = Cookies.get("authToken");
            if (!savedToken) {
                navigate("/"); // Redirect if no auth token
                return;
            }
        
            const fetchOrders = async () => {
                try {
                    const response = await axios.post(
                        API_URL, 
                        {
                          page:1,
                           pageSize:30
                        },  // Empty object for POST body (modify if API requires specific parameters)
                        {
                            headers: {
                                Authorization: `Bearer ${savedToken}`,
                            },
                        }
                    );
        
                    console.log("Full API Response:", response); // Debugging
                    console.log("API Data:", response.data); // Log data field
        
                    if (!response.data || !response.data.data) {
                        throw new Error("Invalid API response structure");
                    }
        
                    const orders = response.data.data;
                    
                    setRows(response.data.data || []);
                } catch (err) {
                    setError(`Failed to fetch Order data: ${err.response?.data?.message || err.message}`);
                    console.error("API Fetch Error:", err.response?.data || err.message);
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
       
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const savedToken = Cookies.get("authToken");
      
        // Ensure token exists before making the request
        if (!savedToken) {
          Swal.fire({
            icon: "error",
            title: "Authentication Error",
            text: "Authentication token not found. Please log in.",
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
          type: "render",
        };
      
        console.log("Sending data:", dataToSend); // Debugging log
      
        try {
          const response = await axios.put(
            window.url + "render/addRenderDesigner",
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${savedToken}`,
                "Content-Type": "application/json",
              },
            }
          );
      
          // Success alert after successful response
          Swal.fire({
            icon: "success",
            title: "Render Designer Created",
            text: `Render Designer created successfully`,
          });
      
          // const tasks = response.data.tasks[0];
      
          // if (response.data && response.data.tasks && Array.isArray(response.data.tasks)) {
          //   // Optional: process tasks if needed
          //   // alert(response.data.tasks[0].id)
          // } else {
          //   console.error("Unexpected API response format:", response.data);
          //   setError("Invalid API response format.");
          // }
      
          // Redirect after saving
          navigate("/renderApproval__list");
        } catch (error) {
          // Error alert if request fails
          console.error(
            "Error creating Render Designer:",
            error.response ? error.response.data : error.message
          );
      
          Swal.fire({
            icon: "error",
            title: "Error Creating Render Designer",
            text: "Something went wrong. Please try again.",
          });
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
      navigate(`/render_designer/${orderId}`);
  };
  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
    <SideBar pageName="userrolePermissions" />
    <div className="main-panel">
      <Header />
      <div className="container">
        <div className="page-inner">
          <div className="page-header">
            <h3 className="fw-bold mb-3">Render Approval List</h3>
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
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="In Progress">In Progress</option>
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
                    <>
                      <div className="table-responsive">
                        <table className="display table table-striped table-hover relative">
                          <thead>
                            <tr>
                              <th>Render ID</th>
                              
                              <th>Concept ID</th>
                              <th>Required Render Count</th>
                              {/* <th>Image</th> */}
                              <th>Sketcher</th>
                             
                             
                              <th>Status</th>
                              <th>Approval</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRows.map((row) => (
                              <React.Fragment key={row.id}>
                                {activeRowId === row.id && (
                                  <tr className="absolute w-full bg-gray-100 border-b border-gray-300">
                                    <td colSpan="11" className="p-2">
                                      <div className="flex justify-between px-4" >
                                        <button
                                        
                                          onClick={() => handleEdit(row.id)}
                                          disabled={row.status !== "Pending"}
                                          className="p-2 rounded-md flex items-center bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                          <FaEdit />
                                        </button>{" "}
                                        &nbsp;
                                        <button
                                         
                                          onClick={() => handleDelete(row.id)}
                                          disabled={row.status !== "Pending"}
                                          className="p-2 rounded-md flex items-center bg-red-500 text-white hover:bg-red-600"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <td>{row.id}</td>
                                 
                                  <td>{row.orderId}</td>
                                  <td>{row.reqRenderCount}</td>
                                  {/* <td>
  {Array.isArray(row.imageUrls) && row.imageUrls.length > 0 ? (
  <Image.PreviewGroup>
    {row.imageUrls.map((img, index) => (
      <Image key={index} src={img} width="40%" alt={`image-${index}`} />
    ))}
  </Image.PreviewGroup>
) : row.imageUrls ? (
  <Image src={row.imageUrls} width="100%" alt="single-image" />
) : (
  <p>No Image Available</p>
)}

                                    </td> */}
                                  <td>Vishnu</td>
                                  <td>0</td>
                                  
                                 
                                 
                                <td style={{ minWidth: "200px", whiteSpace: "pre-line" }}>
                                  <select
                                    value={row.status}
                                    onChange={(e) => handleApprovalChange(row.id, e.target.value)}
                                    className="form-select"
                                    disabled={row.status === "Approved"}
                                  >
                                    <option value="Approved">Approved</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Initiated">Initiated</option>
                                  </select>
                                </td>

                                <td style={{ minWidth: "200px", whiteSpace: "pre-line" }}>
                                  <div>
                                    <button 
                                     onClick={() => handleAddDesignerClick(row.id)}
                                      className="btn btn-sm" 
                                      style={{backgroundColor:"#2E1A47",color:"white"}}
                                     
                                    >
                                      Add Designer
                                    </button>

                                    {isModalOpen && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <div className="modal-header">
        <h5>Add Render Designer</h5>
        <button className="close-btn" onClick={handleCloseModal}>
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
                                <td style={{ minWidth: "250px", whiteSpace: "pre-line" }}>
                                  <button 
                                    onClick={() => handleMoveToDesign(row.id)} 
                                    disabled={row.renderStatus === "design" || row.status !== "Approved"} 
                                    className={`btn btn-sm ${row.renderStatus === "design" ? "btn-secondary" : row.status === "Approved" ? "btn-success" : "btn-secondary"}`}
                                  >
                                    {row.renderStatus === "design" ? "Moved to Design" : "Move to Design"}
                                  </button>
                                </td>
                          
                       


                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="w-full flex justify-end pr-4 " style={{
                        display: "flex",
                        justifyContent:"flex-end"
                      }}>
                        <div className="pagination flex space-x-2 mt-4">
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md bg-gray-500 text-white hover:bg-gray-600"
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
                            className="px-3 py-1 border rounded-md bg-gray-500 text-white hover:bg-gray-600"
                          >
                            <FaChevronRight />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
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

export default RenderApprovalList