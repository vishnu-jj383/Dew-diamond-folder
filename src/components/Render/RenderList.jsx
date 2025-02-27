import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
import { useSelector } from "react-redux";
function RenderList() {
   
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRowId, setActiveRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
   const sideBarState = useSelector(state => state?.sidebar?.sideBar)
    // Filters State
    const [promiseStartDate, setPromiseStartDate] = useState("");
    const [promiseEndDate, setPromiseEndDate] = useState("");
    const [completedStartDate, setCompletedStartDate] = useState("");
    const [completedEndDate, setCompletedEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const handleEdit = (renderId) => {
      // Implement your edit logic here
      navigate(`/render_edit/${renderId}`);
  };
    // useEffect(() => {
    //   const savedToken = Cookies.get("authToken");
    //   if (!savedToken) {
    //     navigate("/");
    //     return;
    //   }
  
    //   const fetchOrders = async () => {
    //     try {
    //       const response = await axios.get(API_URL, {
    //         headers: {
    //           Authorization: `Bearer ${Cookies.get("authToken")}`,
    //         },
    //       });
    //       setRows(response.data.data || []);
    //       setFilteredRows(response.data.data || []);
    //     } catch (err) {
    //       setError(`Failed to fetch Order data: ${err.message}`);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
  
    //   fetchOrders();
    // }, [navigate]);
    const API_URL = window.url+"render/getAllRenders";

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
                    {},  // Empty object for POST body (modify if API requires specific parameters)
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
    
        fetchOrders();
    }, [navigate]);
  
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
  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      <SideBar pageName="userrolePermissions" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Render List</h3>
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
                                <th style={{whiteSpace:"nowrap"}}>Render ID</th>
                                
                                <th style={{whiteSpace:"nowrap"}}>Concept ID</th>
                                <th style={{whiteSpace:"nowrap"}}>Required Render Count</th>
                                {/* <th>Image</th> */}
                                <th style={{whiteSpace:"nowrap"}}>Render Name</th>
                                <th style={{whiteSpace:"nowrap"}}>Started Date</th>
                                <th style={{whiteSpace:"nowrap"}}>Days in Render</th>
                               
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row) => (
                               
                                  <tr key={row.id}> 
                                    <td>{row.id}</td>
                                   
                                    <td>{row.orderId}</td>
                                    <td>{row.reqRenderCount}</td>
                                    {/* <td>"null"</td> */}
                                    <td>Vishnu</td>
                                    
                                    <td>{row.renderBriefDateFormatted}</td>
                                    <td>1</td>
                                    <td>{row.status}</td>
                                     <td>
                                    <FaEdit size={13}
                                        className="text-blue-500 cursor-pointer"
                                            onClick={() => handleEdit(row.id)}
                                                                        />&nbsp;&nbsp;&nbsp;
                                                                        <FaTrash size={13}
                                                                          className="text-red-500 cursor-pointer ml-2"
                                                                          onClick={() => handleDelete(row.id)}
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

export default RenderList