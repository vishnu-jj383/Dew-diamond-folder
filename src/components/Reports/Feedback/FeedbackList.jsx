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
import Footer from "../../Footer";
import Header from "../../Header";
import SideBar from "../../SideBar";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { Button, Modal, Select, Image , Card} from "antd";
function FeedbackList() {
    const API_URL =  window.url+"customerAlbums/getAllCustomerFeedback";
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRowId, setActiveRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState("");
  
    // Filters State
    const [promiseStartDate, setPromiseStartDate] = useState("");
    const [promiseEndDate, setPromiseEndDate] = useState("");
    const [completedStartDate, setCompletedStartDate] = useState("");
    const [completedEndDate, setCompletedEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const handleEdit = (customerId) => {
      // Implement your edit logic here
      navigate(`/cad_edit/${customerId}`);
  };
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
          setRows(response.data.data || []);
          setFilteredRows(response.data.data || []);
        } catch (err) {
          setError(`Failed to fetch Order data: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, [navigate]);
  
    // Filtering Logic
    useEffect(() => {
      let updatedRows = rows;
      if (customerName) {
        updatedRows = updatedRows.filter((row) =>
          row.customer_name.toLowerCase().includes(customerName.toLowerCase())
        );
      }
      setFilteredRows(updatedRows);
    }, [customerName, rows]);
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <div className="wrapper">
        <SideBar pageName="userrolePermissions" />
        <div className="main-panel">
          <Header />
          <div className="container">
            <div className="page-inner">
              <div className="page-header">
                <h3 className="fw-bold mb-3">Customer Feedback</h3>
              </div>
              <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body filter-section">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label>Search Customer Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Customer Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
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
                                  <th>design Update No</th>
                                  <th style={{whiteSpace:"nowrap"}}>Concept ID</th>
                                  <th style={{whiteSpace:"nowrap"}}>customer_name</th>
                                  {/* <th>Image</th> */}
                                  <th style={{whiteSpace:"nowrap"}}>remarks</th>
                                  <th style={{whiteSpace:"nowrap"}}>metal type</th>
                                  
                                  <th style={{whiteSpace:"nowrap"}}>metal color name</th>
                                  <th style={{whiteSpace:"nowrap"}}>image</th>
                                  
                                 
                                </tr>
                              </thead>
                              <tbody>
                                {currentRows.map((row) => (
                                  <tr key={row.id}>
                                    <td>{row.id}</td>
                                    <td>{row.designUpdateNo}</td>
                                    <td>{row.orderId}</td>
                                    <td>{row.customer_name}</td>
                                    <td>{row.remarks}</td>
                                    
                                    <td>{row.MetalType.metal_type}</td>
                                    <td>{row.MetalColor.metal_color_name}</td>
                                    {/* <td>{row.imageUrls}</td> */}
                                    <td>
                                    {Array.isArray(row.imageUrls) && row.imageUrls.length > 0 ? (
                                      <Image.PreviewGroup>
                                        {row.imageUrls.map((img, index) => (
                                          <Image key={index} src={img} width="70%" alt={`image-${index}`} />
                                        ))}
                                      </Image.PreviewGroup>
                                    ) : row.imageUrls ? (
                                      <Image src={row.imageUrls} width="100%" alt="single-image" />
                                    ) : (
                                      <p>No Image Available</p>
                                    )}
                                  </td>
                                    {/* <td>
                                      <FaEdit
                                        onClick={() => handleEdit(row.id)}
                                        className={row.status !== "Pending" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                      />
                                      &nbsp;&nbsp;&nbsp;
                                      <FaTrash
                                        onClick={() => handleDelete(row.id)}
                                        className={row.status !== "Pending" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                      />
                                    </td> */}
                                  
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

export default FeedbackList