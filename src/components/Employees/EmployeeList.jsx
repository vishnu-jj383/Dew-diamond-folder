import { useSelector } from "react-redux";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import EmployeeListTable from "./EmployeeListTable";

const EmployeeList = () => {
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)
  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      {/* Sidebar */}
      <SideBar />
      {/* End Sidebar */}
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Employee List</h3>
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
                  <a href="#">Employee</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a href="#">Lists</a>
                </li>
              </ul>
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
                            <th>id</th>
                            <th>first Name</th>
                            <th>last nname</th>
                            <th>subsidiary</th>
                            <th>designation</th>
                            <th>role</th>
                            <th>department</th>
                            <th>mob no</th>
                            <th>email</th>
                            {/* <th></th> */}
                          </tr>
                        </thead>
                        <tbody>
                            <EmployeeListTable />
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

export default EmployeeList;
