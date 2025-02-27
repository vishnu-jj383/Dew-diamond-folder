import React, { useState } from "react";
import Footer from "../../Footer";
import SideBar from "../../SideBar";
import Header from "../../Header";
import SentCustomerTable from "./SentCustomerTable";
import { useSelector } from "react-redux";

const SentToCustomer = () => {
 const sideBarState = useSelector(state => state?.sidebar?.sideBar)

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    customer: "",
    orderId: "",
  });

  const handleFilterChange = (e) => {
    debugger;
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Albums</h3>
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
                  <a href="#">Albums</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a href="#">Sent to Customer</a>
                </li>
              </ul>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body filter-section">
                    <div className="row g-3 align-items-end">
                      {/* Search */}
                      <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                        <label className="filter-labels">Search</label>
                        <input
                          type="text"
                          className="form-control w-100"
                          name="customer"
                          placeholder="Enter customer name"
                          value={filters.customer}
                          onChange={handleFilterChange}
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
                    <div className="table-responsive">
                      <table
                        id="basic-datatables"
                        className="display table table-striped table-hover"
                      >
                        <thead>
                          <tr>
                            <th></th> {/* Eye Icon Column */}
                            <th>Date</th>
                            <th>Images</th>
                            <th>Album</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Whatsapp</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                            <SentCustomerTable />
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
  );
};

export default SentToCustomer;
