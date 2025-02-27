import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';

import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import {
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Swal from 'sweetalert2';
const ApprovalLists = () => {
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)
 const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const navigate = useNavigate();
  
    // Filters State
    const [promiseStartDate, setPromiseStartDate] = useState("");
    const [promiseEndDate, setPromiseEndDate] = useState("");
    const [completedStartDate, setCompletedStartDate] = useState("");
    const [completedEndDate, setCompletedEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
  const API_URL =  window.url+"sketch";

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
          pageSize:30
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

  const handleApprovalChange = async (id, value) => {
    let reason = "";
  
    if (value === "Approved") {
      // Show confirmation dialog before proceeding
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do You Want To Approve This Sketch?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve It!",
        cancelButtonText: "No, Cancel!",
      });
  
      if (!result.isConfirmed) {
        // If the user cancels, just return and do nothing
        return;
      }
    }
  
    if (value === "Rejected") {
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
        window.url + "sketch/updateSketchStatus",
        {
          sketchId: id,
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
            text: "Sketch status updated successfully.",
          });
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update sketch status. Please try again.",
          });
    }
  };
  // const handleMoveToSkitch = async (id) => {
  //   try {
  //     const response = await axios.put(
  //        window.url+"sketch/moveToCad",
  //       { sketchId: id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("authToken")}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.id === id ? { ...row, sketchStatus: "cad" } : row
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error moving to Sketch:", error);
  //   }
  // };
  const handleMoveToSkitch = async (id) => {
    const confirmMove = await Swal.fire({
      title: "Do you want to move?",
      text: "This action will update the sketch status to CAD.",
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
        window.url + "sketch/moveToCad",
        { sketchId: id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
  
      console.log(response.data);
  
      // Update sketch status after success
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, sketchStatus: "cad" } : row
        )
      );
  
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Moved Successfully!",
        text: "The sketch status has been updated to CAD.",
      });
  
    } catch (error) {
      console.error("Error moving to Sketch:", error);
  
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to move the sketch. Please try again.",
      });
    }
  };
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
              <h3 className="fw-bold mb-3">Sketch Approval List</h3>
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
                          <option value="Completed">Completed</option>
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
                      <p style={{ color: 'red' }}>{error}</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="display table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Sketch No</th>
                              <th>Order ID</th>
                              <th>Request Sketch Count</th>
                              <th>Sketch Status</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
  {currentRows.map((row) => (
    <tr key={row.id}>
      <td>{row.sketchNo}</td>
      <td>{row.orderId}</td>
      <td>{row.reqSketchCount}</td>
      <td>{row.sketchStatus}</td>
      <td>
        <select
          value={row.status}
          onChange={(e) => handleApprovalChange(row.id, e.target.value)}
          className="form-select"
          disabled={row.status === "Approved" || row.status === "Rejected"}
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
      <td>
        <button 
          onClick={() => handleMoveToSkitch(row.id)} 
          disabled={row.sketchStatus !== "sketch" || row.status !== "Approved"} 
          className={`btn btn-sm ${row.sketchStatus !== "sketch" ? "btn-secondary" : row.status === "Approved" ? "btn-success" : "btn-secondary"}`}
        >
          {row.sketchStatus !== "sketch" ? "Moved to CAD" : "Move to Cad"}
        </button>
      </td>
    </tr>
  ))}
</tbody>
                        </table>
                      </div>
                    )}
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

export default ApprovalLists;
