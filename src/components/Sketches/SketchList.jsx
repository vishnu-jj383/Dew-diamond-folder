


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
const SketchList = () => {
  const API_URL =  window.url+"sketch";

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  // Filters State
  const [promiseStartDate, setPromiseStartDate] = useState("");
  const [promiseEndDate, setPromiseEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

      
       const sideBarState = useSelector(state => state?.sidebar?.sideBar)
  
useEffect(() => {
  const savedToken = Cookies.get("authToken");
  if (!savedToken) {
    navigate("/");
    return;
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${API_URL}/getAllSketches`, {
        page:1,
        pageSize:20
      }, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      
      const orders = response.data.data || [];
      setRows(orders);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [navigate]);

// Handle Edit
const handleEdit = (customerId) => {
  navigate(`/edit/${customerId}`);
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

  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      <SideBar pageName="userrolePermissions" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Skitch List</h3>
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
                              <th>Sketch ID</th>
                              <th>Concept ID	</th>
                              {/* <th>Image</th> */}
                              <th>Sketcher Name</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row) => (
                                <tr key={row.id}>
                                 <td>{row.sketchNo}</td>
                                <td>{row.orderId}</td>
                                {/* <td>Null</td> */}
                                <td>Vishnu</td>
                                <td>
                                {row.status}
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
                                  <td>
  <FaEdit
    onClick={() => {
      if (row.status !== "Approved" && row.status !== "Rejected") {
        handleEdit(row.id);
      }
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
};

export default SketchList;
