import { useState } from "react";
import { Carousel, Descriptions, Image } from "antd";
import Footer from "../../Footer";
import Header from "../../Header";
import SideBar from "../../SideBar";
import { useSelector } from "react-redux";

const DewAlbumDetail = () => {
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)

  const images = [
    "https://i.pinimg.com/736x/fe/94/ba/fe94babd8483716a84e2ead8f0e4e1f1.jpg",
    "https://i.pinimg.com/736x/13/9e/e9/139ee974066402dfc74b7944a970ea60.jpg",
    "https://i.pinimg.com/736x/fe/94/ba/fe94babd8483716a84e2ead8f0e4e1f1.jpg",
  ]; // Replace with actual image URLs

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Dew Album Details</h3>
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
                  <a href="#">Dew Albums Details</a>
                </li>
              </ul>
            </div>

            {/* Album Section */}
            <div className="album-section flex gap-8 p-4 bg-white rounded-lg shadow-md">
              {/* Left: Image & Carousel */}
              <div className="w-1/2">
                <Image width={400} src={selectedImage} />
                <Carousel
                  dots={false}
                  slidesToShow={3}
                  className="mt-4"
                  arrows
                  style={{
                    width: "27%",
                  }}
                >
                  {images.map((img, index) => (
                    <div key={index} onClick={() => setSelectedImage(img)}>
                      <Image width={100} src={img} preview={false} />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Right: Details */}
              <div className="w-1/2 album-de-right-section">
                <Descriptions
                  className="fw-bold"
                  title="Specifications"
                  bordered
                  column={1}
                >
                  <Descriptions.Item label="Name">
                    Dew Collection
                  </Descriptions.Item>
                  <Descriptions.Item label="Metal Color">
                    Gold
                  </Descriptions.Item>
                  <Descriptions.Item label="Metal Type">
                    18K Gold
                  </Descriptions.Item>
                  <Descriptions.Item label="Net Weight">
                    12.5g
                  </Descriptions.Item>
                  <Descriptions.Item label="Gross Weight">
                    13.2g
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DewAlbumDetail;
