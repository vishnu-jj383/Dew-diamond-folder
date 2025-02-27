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


function ListCustomer() {
    const API_URL =  window.url+"customer/getAllCustomers";
    const DELETE_URL =  window.url+"customer/deleteCustomer"; 
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRowId, setActiveRowId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [customerNameFilter, setCustomerNameFilter] = useState("");
    const rowsPerPage = 5;
    const navigate = useNavigate();
  
   
    
    const handleEdit = (customerId) => {
        console.log("Navigating to:", `/edit-customer/${customerId}`);
        navigate(`/edit-customer/${customerId}`);
    };
  const handleDelete = async (customerId) => {
    try {
        const savedToken = Cookies.get("authToken");
        await axios.delete(`${DELETE_URL}/${customerId}`, {
            headers: {
                Authorization: `Bearer ${savedToken}`,
            },
        });
        setData(data.filter(customer => customer.id !== customerId)); // Update the data state after deletion
        alert('Customer deleted successfully!');
    } catch (err) {
        alert('Failed to delete customer.');
        console.error(err);
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
      if (customerNameFilter) {
          updatedRows = rows.filter(row =>
              row.customer_first_name.toLowerCase().includes(customerNameFilter.toLowerCase())
          );
      }
      setFilteredRows(updatedRows);
      setCurrentPage(1); // Reset to first page after search
  }, [customerNameFilter, rows]);
  
  // Pagination logic - Apply pagination after filtering
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
              <h3 className="fw-bold mb-3">Customer List</h3>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body filter-section">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                      <label>Search by Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter customer name"
                  value={customerNameFilter}
                  onChange={(e) => setCustomerNameFilter(e.target.value)}
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
                                <th style={{whiteSpace:"nowrap"}}>First Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th >Address</th>
                                <th>Pincode</th>
                                <th>Type</th>
                                <th>Fax</th>
                                <th style={{whiteSpace:"nowrap"}}>Customer Code</th>
                                <th>Subsidiary</th>
                                <th>Country</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row) => (
                                <tr key={row.id}>
                                  <td>{row.id}</td>
                                  <td >{row.customer_first_name}</td>
                                  <td>{row.customer_email}</td>
                                  <td>{row.phone_number}</td>
                                  <td style={{ minWidth: "250px", whiteSpace: "pre-line" }}>{row.address}</td>
                                  <td>{row.pincode}</td>
                                  <td>{row.customer_type}</td>
                                  <td>{row.customer_fax}</td>
                                  <td>{row.customercode}</td>
                                  <td>{row.country_subsidiary}</td>
                                  <td>{row.customer_country}</td>
                                  <td>
                                    <FaEdit size={13}
                                      className="text-blue-500 cursor-pointer"
                                      onClick={() => handleEdit(row.id)}
                                    />&nbsp;&nbsp;
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
                              <FaChevronRight  />
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

export default ListCustomer