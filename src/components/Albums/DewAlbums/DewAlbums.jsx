import { Row } from "antd";
import AlbumCard from "./AlbumCard";
import Footer from "../../Footer";
import Header from "../../Header";
import SideBar from "../../SideBar";
import { useSelector } from "react-redux";

const DewAlbums = () => {
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
              <h3 className="fw-bold mb-3">Dew Albums</h3>
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
                  <a href="#">Dew Albums</a>
                </li>
              </ul>
            </div>
            <Row gutter={[16, 16]} justify="center">
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
                <AlbumCard />
            </Row>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DewAlbums;
