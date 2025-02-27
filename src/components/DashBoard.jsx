import React from "react";
import { Card, Avatar } from "antd";
import {
  SketchOutlined,
  EditOutlined,
  BuildOutlined,
  FileTextOutlined,
  PictureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/charts"; 
import Table from "./Table";
import Header from "./Header";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { useSelector } from "react-redux";

const DashBoard = () => {
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);

  // Manually defined items for each category
  const cardData = [
    { title: "PD/Concept", icon: <SketchOutlined />, color: "#667eea", items: ["Create PD", "Lists", 'Approval Lists'] },
    { title: "Sketches", icon: <EditOutlined />, color: "#ff9a9e", items: ["Lists", 'Approval Lists', "Grid View"] },
    { title: "Design", icon: <BuildOutlined />, color: "#42e695", items: ["Design Bank", "Design Master"] },
    { title: "Reports", icon: <FileTextOutlined />, color: "#ff9966", items: ["Design Report", "Designer Report"] },
    { title: "Albums", icon: <PictureOutlined />, color: "#56ccf2", items: ["Sent to Customer", "Dew Album"] },
    { title: "Employees", icon: <UserOutlined />, color: "#f4d03f", items: ["Add Employee", "List"] },
  ];

  // Prepare data for Pie Chart
  const chartData = cardData.map((item) => ({
    type: item.title,
    value: item.items.length,
    color: item.color,
  }));

  const chartConfig = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    radius: 1,
    color: cardData.map((item) => item.color),
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 12, fontWeight: "bold", fill: "#fff" },
    },
    interactions: [{ type: "element-active" }],
    pieStyle: ({ type }) => ({
      stroke: "#fff",
      lineWidth: 2,
      cursor: "pointer",
      transition: "all 0.3s",
      filter: `drop-shadow(0px 5px 10px ${chartData.find(item => item.type === type)?.color}66)`,
    }),
  };

  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {/* Cards Section */}
            <div style={{ flex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {cardData.map((card, index) => (
                <Card
                  key={index}
                  hoverable
                  style={{
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${card.color} 30%, rgba(255,255,255,0.1))`,
                    color: "#fff",
                    padding: "15px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    backdropFilter: "blur(10px)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = `0px 10px 25px ${card.color}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0px 5px 15px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Avatar
                      size={45}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        color: "#fff",
                        backdropFilter: "blur(5px)",
                      }}
                    >
                      {card.icon}
                    </Avatar>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "500" }}>{card.title}</h3>
                  </div>
                  {/* Custom Item List */}
                  <ul style={{ marginTop: "10px", fontSize: "14px", paddingLeft: "15px" }}>
                    {card.items.map((item, i) => (
                      <li key={i} style={{ listStyleType: "circle", marginBottom: "5px" }}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>

            {/* Pie Chart Section */}
            
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashBoard;
