import { useState } from "react";
import Footer from "../../Footer";
import Header from "../../Header";
import SideBar from "../../SideBar";
import DesignerReportTable from "./DesignerReportTable";
import { Button } from "antd";
import { useSelector } from "react-redux";

const DesignerReports = () => {
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)
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
                <h3 className="fw-bold mb-3">Designer Reports</h3>
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
                    <a href="#">Reports</a>
                  </li>
                  <li className="separator">
                    <i className="icon-arrow-right"></i>
                  </li>
                  <li className="nav-item">
                    <a href="#">Designer Reports</a>
                  </li>
                </ul>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body filter-section">
                      <div className="row g-1 align-items-end">
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">Search</label>
                          <input
                            type="text"
                            className="form-control w-100"
                            name="customer"
                            placeholder="Search"
                            value={filters.customer}
                            onChange={handleFilterChange}
                          />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 d-flex flex-column">
                          <label className="filter-labels">
                            Search by Status
                          </label>
                          <select
                            className="form-control w-100"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                          >
                            <option value="">All</option>
                            <option value="Pending">Sketches</option>
                            <option value="Completed">CAD</option>
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
                      <div className="table-responsive">
                        <table
                          id="basic-datatables"
                          className="display table table-striped table-hover"
                        >
                          <thead>
                            <tr>
                              <th rowSpan="2">Designer Name</th>
                              <th rowSpan="2">Designation</th>
                              <th rowSpan="2">Concept ID</th>
                              <th colSpan="2" className="text-center">
                                Sketches Count
                              </th>
                              <th colSpan="2" className="text-center">
                                CAD
                              </th>
                            </tr>
                            <tr>
                              <th className="text-left">Created</th>
                              <th className="text-left">Selected</th>
                              <th className="text-left">Created</th>
                              <th className="text-left">Selected</th>
                            </tr>
                          </thead>
                          <tbody>
                            <DesignerReportTable />
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

export default DesignerReports;
