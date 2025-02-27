import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useEffect, useState } from "react";
import PdTableData from "./PdTableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { getPdLists } from "./services";
const PdLists = () => {
  const dispatch = useDispatch();
  const filtererdData = useSelector((state) => state?.pdLists?.filteredPdLists);

  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);
  const [showEdit, setShowEdit] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    customer: "",
    orderId: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    getPdLists(dispatch);
  }, []);
  console.log("filtererdData",filters);

  const handleFilter = () => {
    if(filters?.customer){
      
    }
  }

  useEffect(() => {
    handleFilter()
  },[filters])


  
  return (
    <>
      <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
        {/* Sidebar */}
        <SideBar />
        {/* End Sidebar */}
        <div className="main-panel">
          <Header />
          <div className="container">
            <div className="page-inner">
              <div className="page-header">
                <h3 className="fw-bold mb-3">PD/Order Lists</h3>
                <ul className="breadcrumbs mb-3">
                  <li className="nav-home">
                    <a href="#">
                      <i className="icon-home"></i>
                    </a>
                  </li>
                  <li className="separator">
                    <i className="icon-arrow-right"></i>
                  </li>
                  <li className="nav-item">
                    <a href="#">PD/Concept</a>
                  </li>
                  <li className="separator">
                    <i className="icon-arrow-right"></i>
                  </li>
                  <li className="nav-item">
                    <a href="#">Lists</a>
                  </li>
                </ul>
              </div>

              {/* Filter Section */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body filter-section">
                      <div className="row g-3 align-items-end">
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">Start Date</label>
                          <DatePicker
                            selected={filters.startDate ? new Date(filters.startDate) : null}
                            onChange={(date) =>
                              setFilters({ ...filters, startDate: date?.toISOString().split("T")[0] || "" })
                            }
                            className="form-control w-100"
                            placeholderText="Select Start Date"
                            dateFormat="yyyy-MM-dd"
                          />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">End Date</label>
                          <DatePicker
                            selected={filters.endDate ? new Date(filters.endDate) : null}
                            onChange={(date) =>
                              setFilters({ ...filters, endDate: date?.toISOString().split("T")[0] || "" })
                            }
                            className="form-control w-100"
                            placeholderText="Select End Date"
                            dateFormat="yyyy-MM-dd"
                          />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">Search by Status</label>
                          <select
                            className="form-control w-100"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                          >
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">Search by Customer</label>
                          <input
                            type="text"
                            className="form-control w-100"
                            name="customer"
                            placeholder="Enter customer name"
                            value={filters.customer}
                            onChange={handleFilterChange}
                          />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">Search by Order ID</label>
                          <input
                            type="text"
                            className="form-control w-100"
                            name="orderId"
                            placeholder="Enter order id"
                            value={filters.orderId}
                            onChange={handleFilterChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Filter Section */}

              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table
                          id="basic-datatables"
                          className="display table table-striped table-hover"
                        >
                          <thead>
                            <tr>
                              <th></th>
                              <th>Date</th>
                              <th>Concept Id</th>
                              <th>Customer</th>
                              <th>Promised Date</th>
                              <th>Status</th>
                              <th>Sketches</th>
                              <th>CAD</th>
                              <th>Designs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtererdData?.map((item) => {
                              return <PdTableData key={item?.id} data={item}/>;
                            })}
                          </tbody>
                        </table>
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
    </>
  );
};

export default PdLists;
