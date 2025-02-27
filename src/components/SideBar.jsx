import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  changeActiveLink,
  changeSubMenu,
  toggleSideBar,
} from "../reducers/sideBarReducer";
import { SlDiamond } from "react-icons/sl";
import dewicon from "./dew-icon.webp"

const SideBar = () => {
  const activeLink = useSelector((state) => state?.sidebar?.activeLink);
  const subMenu = useSelector((state) => state?.sidebar?.subMenu);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="sidebar" data-background-color="dark">
      <div className="sidebar-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <a href="index.html" className="logo">
          <SlDiamond style={{
            width: "24px",
            height: "24px",
            color: "white",

          }}/> 
          
          <span
          style={{
            margin: "0 9px",
            color: "white",
            fontSize: "14px"
          }}
          >Dew Diamonds</span>
          </a>
          <div className="nav-toggle" onClick={() => dispatch(toggleSideBar())}>
            <button className="btn-toggle">
              <i className="gg-menu-right" />
            </button>
            <button className="btn btn-toggle sidenav-toggler">
              <i className="gg-menu-left" />
            </button>
          </div>
          <button className="topbar-toggler more">
            <i className="gg-more-vertical-alt" />
          </button>
        </div>
        {/* End Logo Header */}
      </div>
      <div className="sidebar-wrapper scrollbar scrollbar-inner">
        <div className="sidebar-content">
          <ul className="nav nav-secondary">
            <li
              className={`nav-item ${
                activeLink === "dashboard" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("dashboard"))}
            >
              <a
                data-bs-toggle="collapse"
                // href="#dashboard"
                className="collapsed"
                // aria-expanded="false"
              >
                <i className="fas fa-home" />
                <p onClick={() => navigate("/")}>Dashboard</p>
                {/* <span className="caret" />   */}
              </a>
              {/* <div className="collapse" id="dashboard">
                <ul className="nav nav-collapse">
                  <li>
                    <a href="../demo1/index.html">
                      <span className="sub-item">Dashboard 1</span>
                    </a>
                  </li>
                </ul>
              </div> */}
            </li>
            {/* <li className="nav-section">
              <span className="sidebar-mini-icon">
                <i className="fa fa-ellipsis-h" />
              </span>
              <h4 className="text-section">Components</h4>
            </li> */}
            {/* <li className="nav-item">
              <a data-bs-toggle="collapse" href="#base">
                <i className="fas fa-layer-group" />
                <p>Base</p>
                <span className="caret" />
              </a>
              <div className="collapse" id="base">
                <ul className="nav nav-collapse">
                  <li>
                    <a href="components/avatars.html">
                      <span className="sub-item">Avatars</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/buttons.html">
                      <span className="sub-item">Buttons</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/gridsystem.html">
                      <span className="sub-item">Grid System</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/panels.html">
                      <span className="sub-item">Panels</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/notifications.html">
                      <span className="sub-item">Notifications</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/sweetalert.html">
                      <span className="sub-item">Sweet Alert</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/font-awesome-icons.html">
                      <span className="sub-item">Font Awesome Icons</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/simple-line-icons.html">
                      <span className="sub-item">Simple Line Icons</span>
                    </a>
                  </li>
                  <li>
                    <a href="components/typography.html">
                      <span className="sub-item">Typography</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li> */}
            {/* <li className="nav-item">
              <a data-bs-toggle="collapse" href="#sidebarLayouts">
                <i className="fas fa-th-list" />
                <p>Sidebar Layouts</p>
                <span className="caret" />
              </a>
              <div className="collapse" id="sidebarLayouts">
                <ul className="nav nav-collapse">
                  <li>
                    <a href="sidebar-style-2.html">
                      <span className="sub-item">Sidebar Style 2</span>
                    </a>
                  </li>
                  <li>
                    <a href="icon-menu.html">
                      <span className="sub-item">Icon Menu</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li> */}
            <li
              className={`nav-item ${activeLink === "pd" ? "active" : ""}`}
              onClick={() => dispatch(changeActiveLink("pd"))}
            >
              <a data-bs-toggle="collapse" href="#forms">
                <i className="fas fa-pen-square" />
                <p>PD/Concept</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${activeLink === "pd" ? "show" : ""}`}
                id="forms"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "createPd" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/createOrder");
                      dispatch(changeSubMenu("createPd"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Create PD</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "pdList" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/pdLists");
                      dispatch(changeSubMenu("pdList"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "pdApproval" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/approvalLists");
                      dispatch(changeSubMenu("pdApproval"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Approval Lists</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            {/* <li className="nav-item">
              <a data-bs-toggle="collapse" href="#tables">
                <i className="fas fa-table" />
                <p>Tables</p>
                <span className="caret" />
              </a>
              <div className="collapse" id="tables">
                <ul className="nav nav-collapse"> */}
            {/* <li>
                    <a href="tables/tables.html">
                      <span className="sub-item">Basic Table</span>
                    </a>
                  </li> */}
            {/* <li onClick={() => navigate('/dataTable')}>
                    <a>
                      <span className="sub-item">Datatables</span>
                    </a>
                  </li> */}
            {/* </ul>
              </div>
            </li> */}
            <li
              className={`nav-item ${
                activeLink === "sketches" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("sketches"))}
            >
              <a data-bs-toggle="collapse" href="#maps">
                <i className="fas fa-map-marker-alt" />
                <p>Sketches</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${
                  activeLink === "sketches" ? "show" : ""
                }`}
                id="maps"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "sketchList" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/sketchList");
                      dispatch(changeSubMenu("sketchList"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                  <li
                    className={`${
                      subMenu === "sketchApproval" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/sketchApproval");
                      dispatch(changeSubMenu("sketchApproval"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Approval Lists</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "sketchGrid" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/sketchGridView");
                      dispatch(changeSubMenu("sketchGrid"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Sketch Grid View</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>


            <li
              className={`nav-item ${
                activeLink === "cad" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("cad"))}
            >
              <a data-bs-toggle="collapse" href="#mapss">
                <i className="fas fa-map-marker-alt" />
                <p>Cad</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${
                  activeLink === "cad" ? "show" : ""
                }`}
                id="mapss"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "cadList" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/cadlist");
                      dispatch(changeSubMenu("cadList"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                  <li
                    className={`${
                      subMenu === "cadApproval" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/cad_approval_list");
                      dispatch(changeSubMenu("cadApproval"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Approval Lists</span>
                    </a>
                  </li>
                
                </ul>
              </div>
            </li>


            <li
              className={`nav-item ${
                activeLink === "render" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("render"))}
            >
              <a data-bs-toggle="collapse" href="#renders">
                <i className="fas fa-map-marker-alt" />
                <p>Render</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${
                  activeLink === "render" ? "show" : ""
                }`}
                id="renders"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "renderList" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/render_list");
                      dispatch(changeSubMenu("renderList"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                  <li
                    className={`${
                      subMenu === "renderApproval" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/renderApproval__list");
                      dispatch(changeSubMenu("renderApproval"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Approval Lists</span>
                    </a>
                  </li>
                
                </ul>
              </div>
            </li>

            <li
              className={`nav-item ${activeLink === "design" ? "active" : ""}`}
              onClick={() => dispatch(changeActiveLink("design"))}
            >
              <a data-bs-toggle="collapse" href="#design">
                <i className="fas fa-user" />
                <p>Design</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${activeLink === "design" ? "show" : ""}`}
                id="design"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "designBank" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/designBank");
                      dispatch(changeSubMenu("designBank"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Design Bank</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "designMaster" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/designMaster");
                      dispatch(changeSubMenu("designMaster"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Design Master</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`nav-item ${activeLink === "reports" ? "active" : ""}`}
              onClick={() => dispatch(changeActiveLink("reports"))}
            >
              <a data-bs-toggle="collapse" href="#charts">
                <i className="far fa-chart-bar" />
                <p>Reports</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${activeLink === "reports" ? "show" : ""}`}
                id="charts"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "designReport" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/designReports");
                      dispatch(changeSubMenu("designReport"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Design Reports</span>
                    </a>
                  </li>
                  <li
                    className={`${
                      subMenu === "designerReport" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/designerReports");
                      dispatch(changeSubMenu("designerReport"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Designer Reports</span>
                    </a>
                  </li>

                  <li
                    className={`${
                      subMenu === "feedback" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/feedbacklist");
                      dispatch(changeSubMenu("feedback"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Customer Feedback</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`nav-item ${activeLink === "albums" ? "active" : ""}`}
              onClick={() => dispatch(changeActiveLink("albums"))}
            >
              <a data-bs-toggle="collapse" href="#albums">
                <i className="fas fa-file" />
                <p>Albums</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${activeLink === "albums" ? "show" : ""}`}
                id="albums"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${
                      subMenu === "sentToCustomer" ? "active" : ""
                    }`}
                    onClick={() => {
                      navigate("/sentToCustomer");
                      dispatch(changeSubMenu("sentToCustomer"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Send to Customer</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "dewAlbums" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/dewAlbum");
                      dispatch(changeSubMenu("dewAlbums"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Dew Albums</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>


            <li
              className={`nav-item ${
                activeLink === "customer" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("customer"))}
            >
              <a data-bs-toggle="collapse" href="#customer">
                <i className="fas fa-user" />
                <p>Customers</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${
                  activeLink === "customer" ? "show" : ""
                }`}
                id="customer"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "createCustomer" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/create_customer");
                      dispatch(changeSubMenu("createCustomer"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Add Customer</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "customerLists" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/customer__list");
                      dispatch(changeSubMenu("customerLists"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>


            <li
              className={`nav-item ${
                activeLink === "employees" ? "active" : ""
              }`}
              onClick={() => dispatch(changeActiveLink("employees"))}
            >
              <a data-bs-toggle="collapse" href="#employees">
                <i className="fas fa-user" />
                <p>Employees</p>
                <span className="caret" />
              </a>
              <div
                className={`collapse ${
                  activeLink === "employees" ? "show" : ""
                }`}
                id="employees"
              >
                <ul className="nav nav-collapse">
                  <li
                    className={`${subMenu === "addEmployee" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/addEmployee");
                      dispatch(changeSubMenu("addEmployee"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Add Employee</span>
                    </a>
                  </li>
                  <li
                    className={`${subMenu === "empLists" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/employeeLists");
                      dispatch(changeSubMenu("empLists"));
                    }}
                  >
                    <a>
                      <span className="sub-item">Lists</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            {/* <li className="nav-item">
              <a href="widgets.html">
                <i className="fas fa-desktop" />
                <p>Widgets</p>
                <span className="badge badge-success">4</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="../../documentation/index.html">
                <i className="fas fa-file" />
                <p>Documentation</p>
                <span className="badge badge-secondary">1</span>
              </a>
            </li> */}
            {/* <li className="nav-item">
              <a data-bs-toggle="collapse" href="#submenu">
                <i className="fas fa-bars" />
                <p>Menu Levels</p>
                <span className="caret" />
              </a>
              <div className="collapse" id="submenu">
                <ul className="nav nav-collapse">
                  <li>
                    <a data-bs-toggle="collapse" href="#subnav1">
                      <span className="sub-item">Level 1</span>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="subnav1">
                      <ul className="nav nav-collapse subnav">
                        <li>
                          <a href="#">
                            <span className="sub-item">Level 2</span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="sub-item">Level 2</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a data-bs-toggle="collapse" href="#subnav2">
                      <span className="sub-item">Level 1</span>
                      <span className="caret" />
                    </a>
                    <div className="collapse" id="subnav2">
                      <ul className="nav nav-collapse subnav">
                        <li>
                          <a href="#">
                            <span className="sub-item">Level 2</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="#">
                      <span className="sub-item">Level 1</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
