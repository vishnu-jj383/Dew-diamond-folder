import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from "js-cookie";
import { Modal, Image } from "antd";
function GetDesignerList() {
    const API_URL =  window.url+"tasks/getTasksByOrderIdOrType";
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRowId, setActiveRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
    const { orderId } = useParams();
    // Filters State
    const [promiseStartDate, setPromiseStartDate] = useState("");
    const [promiseEndDate, setPromiseEndDate] = useState("");
    const [completedStartDate, setCompletedStartDate] = useState("");
    const [completedEndDate, setCompletedEndDate] = useState("");
    const [designetNamefilter, setDesignerNamefilter] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
      const savedToken = Cookies.get("authToken");
      if (!savedToken) {
        navigate("/");
        return;
      }
      const getDesignerdata = async () => {
       
        setLoading(true);
        try {
            const requestData = { orderId: orderId ,type:"cad"};
            const response = await axios.post(API_URL, requestData, {
                headers: {
                    Authorization: `Bearer ${savedToken}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("API Response:", response.data); // Debugging API Response

            if (response.data && response.data.tasks && Array.isArray(response.data.tasks)) {
                setRows(response.data.tasks);  // ✅ Corrected the data structure
                setFilteredRows(response.data.tasks);
                // alert(response.data.tasks[0].id)
              } else {
                console.error("Unexpected API response format:", response.data);
                setError("Invalid API response format.");
              }
            } catch (err) {
              console.error("API Fetch Error:", err);
              setError(`Failed to fetch Order data: ${err.message}`);
            } finally {
              setLoading(false);
            }
          };
        getDesignerdata();
    }, [navigate, orderId]); // Added customerId dependency


    
    useEffect(() => {
      let updatedRows = rows;
      if (promiseStartDate && promiseEndDate) {
        updatedRows = updatedRows.filter(row => row.startDate >= promiseStartDate && row.startDate <= promiseEndDate);
      }
      if (completedStartDate && completedEndDate) {
        updatedRows = updatedRows.filter(row => row.endDate >= completedStartDate && row.endDate <= completedEndDate);
      }
      if (designetNamefilter) {
        updatedRows = updatedRows.filter(row => 
          row.name.toLowerCase().includes(designetNamefilter.toLowerCase())
        );
      }
      setFilteredRows(updatedRows);
    }, [promiseStartDate, promiseEndDate, completedStartDate, completedEndDate, designetNamefilter, rows]);
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleEdit = (designerId) => {
        // Implement your edit logic here
        navigate(`/designer_edit/${designerId}`);
    };

    
    return (
      <div className="wrapper">
        {/* <SideBar pageName="userrolePermissions" /> */}
        <div className="main-panel">
          <Header />
          <div className="container">
            <div className="page-inner">
            <ul className="breadcrumbs mb-3">
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                <a href="/cadlist">Cad List</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                <a href="/cad_approval_list">Approval List</a>
                  {/* <a href={`/cad_metal/${customerId}`}>Metal & Material</a> */}
                </li>
              </ul>
              <div className="page-header">
                <h3 className="fw-bold mb-3">Cad Designer List</h3>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body filter-section">
                      <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                          <label>Start Date (Start)</label>
                          <input type="date" className="form-control" value={promiseStartDate} onChange={(e) => setPromiseStartDate(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label>Start Date (End)</label>
                          <input type="date" className="form-control" value={promiseEndDate} onChange={(e) => setPromiseEndDate(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label>End Date (Start)</label>
                          <input type="date" className="form-control" value={completedStartDate} onChange={(e) => setCompletedStartDate(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label>End Date (End)</label>
                          <input type="date" className="form-control" value={completedEndDate} onChange={(e) => setCompletedEndDate(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <label>Name</label>
                         
                          <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                value={designetNamefilter}
                                onChange={(e) => setDesignerNamefilter(e.target.value)}
                                />
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
                                  <th>ID</th>
                                  <th>taskId</th>
                                  <th style={{whiteSpace:"nowrap"}}>orderId</th>
                                  <th style={{whiteSpace:"nowrap"}}>name</th>
                                
                                  <th style={{whiteSpace:"nowrap"}}>startDate</th>
                                  <th style={{whiteSpace:"nowrap"}}>endDate</th>
                                  <th style={{whiteSpace:"nowrap"}}>Image</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentRows.map((row) => (
                                  <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.taskId}</td>
                                    <td>{row.orderId}</td>
                                    <td>{row.name}</td>
                                    <td>{row.startDate}</td>
                                    
                                    <td>{row.endDate}</td>
                                    <td>
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

                                    </td>
                                  
                                    
                                  
        {/* {row.imageUrls ? (
          <img
            src={row.imageUrls} 
            alt="No Image"
            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
          />
        ) : (
          "No Image"
        )} */}

{/* <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      > */}
        
      {/* </Modal> */}

      {/* <td>
      <img src="https://awsbucketjewellery.s3.ap-south-1.amazonaws.comtask/OIP.jpg_1740051477185.jpeg" alt="CAD Designer" style={{ width: '100px', height: 'auto' }} />
      </td> */}
                                   
                                   
                                    <td>
    <FaEdit
      onClick={() => {
        // if (row.status !== "Approved" && row.status !== "Rejected") {
          handleEdit(row.id);
        // }
      }}
      className={
        row.status === "Approved" || row.status === "Rejected"
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }
    />
    &nbsp;&nbsp;&nbsp;
    <FaTrash
      onClick={() => {
        if (row.status !== "Approved" && row.status !== "Rejected") {
          handleDelete(row.id);
        }
      }}
      className={
        row.status === "Approved" || row.status === "Rejected"
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }
    />
  </td>
                                  </tr>
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

export default GetDesignerList