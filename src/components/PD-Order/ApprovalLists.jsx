import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import Cookies from 'js-cookie';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';

const ApprovalLists = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const filtererdData = useSelector((state) => state?.pdLists?.filteredPdLists);

  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);

  const [promiseStartDate, setPromiseStartDate] = useState("");
  const [promiseEndDate, setPromiseEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  if (!window.url) {
    console.error("window.url is not defined. Make sure it's set globally.");
  }

  const API_URL =  window.url +"order/getAllOrders" ;

  // Handle status change with SweetAlert2 confirmation

  const handleApprovalChange = async (id, value) => {
    let reason = "";
  
    if (value === "Approved") {
      // Show confirmation dialog before proceeding
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Approve this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
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
        window.url + "order/updateOrderStatus",
        {
          orderId: id,
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
            text: "Order status updated successfully.",
          });
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update Order status. Please try again.",
          });
    }
  };
  

  // const handleMoveToSkitch = async (id) => {
  //   try {
  //     const response = await axios.put(
  //        window.url+"order/sketchStatus",
  //       { orderId: id },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("authToken")}`,
  //         },
  //       }
  //     );
  //     console.log(response.data);
  //     setRows((prevRows) =>
  //       prevRows.map((row) =>
  //         row.id === id ? { ...row, orderStatus : "order" } : row
  //       )
  //     );
  //     // Reload the page after success
  //   // window.location.reload();

  //   } catch (error) {
  //     console.error("Error moving to Sketch:", error);
  //   }
  // };
  const handleMoveToSkitch = async (id) => {
    const confirmMove = await Swal.fire({
      title: "Do you want to move?",
      text: "This action will update the order status.",
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
        window.url + "order/sketchStatus",
        { orderId: id },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        }
      );
  
      console.log(response.data);
  
      // Update order status after success
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, orderStatus: "sketch" } : row
        )
      );
  
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Moved Successfully!",
        text: "The order status has been updated.",
      });
  
    } catch (error) {
      console.error("Error moving to Sketch:", error);
  
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to move the order. Please try again.",
      });
    }
  };
 
  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.post(API_URL, {
          page: "1",
          pageSize: 30,
        }, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        const orders = response.data.data || [];
        setRows(orders);
      } catch (err) {
        setError("Failed to fetch Order data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    let updatedRows = [...rows];
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
    <div className="wrapper">
      <SideBar pageName="userrolePermissions" />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">PD Approval List</h3>
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
                                <th>ID</th>
                                <th>Concept ID</th>
                                <th>Customer Name</th>
                                <th>Order Date</th>
                                <th>Category</th>
                                <th>Promise Date</th>
                                <th>Status</th>
                                <th>Order Status</th>
                                <th>Approval</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row) => (
                                <tr key={row.id}>
                                  <td>{row.id}</td>
                                  <td>{row.orderNo}</td>
                                  <td>{row["Customer.customer_first_name"]}</td>
                                  <td>{row.orderDate}</td>
                                  <td>{row.categoryName}</td>
                                  <td>{row.promiseDate}</td>
                                  <td>{row.status}</td>
                                  <td>{row.orderStatus}</td>
                                  <td>
                                  <select
                              value={row.status}
                              onChange={(e) => handleApprovalChange(row.id, e.target.value)}
                              className="form-select"
                              style={{ width: "150px" }}
                              disabled={row.status === "Approved" || row.status === "Rejected"}
                            >
                              <option value="Approved">Approved</option>
                              <option value="Pending">Pending</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                              </td>

                              <td style={{ minWidth: "250px", whiteSpace: "pre-line" }}>
  <button 
    onClick={() => handleMoveToSkitch(row.id)} 
    disabled={row.orderStatus !== "order" || row.status !== "Approved" || row.sketchStatus === "cad"} 
    className={`btn btn-sm ${ row.orderStatus !== "order" ? "btn-secondary" : row.status === "Approved" ? "btn-success" : "btn-secondary"} px-4 py-2 w-auto`}
  >
    {row.orderStatus !== "order" || row.status == "Approved" ? "Moved to Sketch" : "Move to Sketch"}
  </button>
</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="w-full flex justify-end pr-4" style={{ display: "flex", justifyContent: "flex-end" }}>
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
                                className={`px-3 py-1 border rounded-md ${currentPage === num + 1 ? "bg-gray-600 text-white" : "bg-gray-300"}`}
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

export default ApprovalLists;
