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
import { Modal, Image } from "antd";

const DesignMaster = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();
  const sideBarState = useSelector(state => state?.sidebar?.sideBar);

  // Search State
  const [searchCategory, setSearchCategory] = useState("");
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [searchNote, setSearchNote] = useState("");

  // Filters State
  const [promiseStartDate, setPromiseStartDate] = useState("");
  const [promiseEndDate, setPromiseEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const API_URL = window.url + "design/getAllDesign";

  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/"); // Redirect if no auth token
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

    // Apply date and status filters
    if (promiseStartDate && promiseEndDate) {
      updatedRows = updatedRows.filter(row => row.promiseDate >= promiseStartDate && row.promiseDate <= promiseEndDate);
    }
    if (completedStartDate && completedEndDate) {
      updatedRows = updatedRows.filter(row => row.cadCompletedDate >= completedStartDate && row.cadCompletedDate <= completedEndDate);
    }
    if (statusFilter) {
      updatedRows = updatedRows.filter(row => row.status === statusFilter);
    }

    // Apply search filters (Category, Subcategory, Note)
    if (searchCategory) {
      updatedRows = updatedRows.filter(row => row.category.toLowerCase().includes(searchCategory.toLowerCase()));
    }
    if (searchSubCategory) {
      updatedRows = updatedRows.filter(row => row.subcategory.toLowerCase().includes(searchSubCategory.toLowerCase()));
    }
    if (searchNote) {
      updatedRows = updatedRows.filter(row => row.note && row.note.toLowerCase().includes(searchNote.toLowerCase()));
    }

    setFilteredRows(updatedRows);
  }, [promiseStartDate, promiseEndDate, completedStartDate, completedEndDate, statusFilter, searchCategory, searchSubCategory, searchNote, rows]);

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
              <h3 className="fw-bold mb-3">Design Master</h3>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body filter-section">
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label>Category</label>
                        <input type="text" className="form-control" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label>Subcategory</label>
                        <input type="text" className="form-control" value={searchSubCategory} onChange={(e) => setSearchSubCategory(e.target.value)} />
                      </div>
                     
                      {/* Your other filters */}
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
                                <th style={{ whiteSpace: "nowrap" }}>Design No</th>
                                <th style={{ whiteSpace: "nowrap" }}>Category</th>
                                <th style={{ whiteSpace: "nowrap" }}>Subcategory</th>
                                <th>Image</th>
                                <th>ProductType</th>
                                <th style={{ whiteSpace: "nowrap" }}>Expected Gross Wt</th>
                                <th style={{ whiteSpace: "nowrap" }}>Brand</th>
                                <th style={{ whiteSpace: "nowrap" }}>Metal</th>
                                <th>Metal Color</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.map((row) => (
                                <tr key={row.id}>
                                  <td>{row.designNo}</td>
                                  <td>{row.category}</td>
                                  <td>{row.subcategory}</td>
                                  <td>
                                    {Array.isArray(row.imageUrls) && row.imageUrls.length > 0 ? (
                                      <Image.PreviewGroup>
                                        {row.imageUrls.map((img, index) => (
                                          <Image key={index} src={img} width="60%" alt={`image-${index}`} />
                                        ))}
                                      </Image.PreviewGroup>
                                    ) : row.imageUrls ? (
                                      <Image src={row.imageUrls} width="100%" alt="single-image" />
                                    ) : (
                                      <p>No Image Available</p>
                                    )}
                                  </td>
                                  <td>{row.productType}</td>
                                  <td>{row.expectedGrossWt}</td>
                                  <td>{row.brand}</td>
                                  <td>{row.metal}</td>
                                  <td>{row.metalColor}</td>
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

export default DesignMaster;
