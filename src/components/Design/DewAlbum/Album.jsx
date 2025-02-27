import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import OTP from "../DewAlbum/otp2.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Image } from "antd";
import "../DewAlbum/Album.css";
import "../DewAlbum/Album.css";

function Album() {
  const navigate = useNavigate();
  const { customer_id } = useParams();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customer_id) return;

    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/");
      return;
    }

    const fetchDesigns = async () => {
      try {
        const response = await axios.get(
          `${window.url}customerAlbums/getAllDesignsForCustomer/${customer_id}`,
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        const customerData = response.data.data || [];

        if (customerData.length === 0) {
          setError("No designs found for this customer.");
        } else {
          setDesigns(customerData);
        }
      } catch (err) {
        setError("Failed to fetch customer data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [customer_id, navigate]);

  const handleFeedback = (designId) => {
    navigate(`/feedback/${designId}`);
  };

  return (
    <div >
      
      {/* Album Cover */}
      <img src={OTP} alt="Album Cover" className="album-cover" />

      <div className="text-center my-4">
        <h2 className="album-title">Design of Album: dewdiamonds</h2>
      </div>

      {/* Album Page */}
      <div className="row">
        {designs.map((design, index) => (
          <div className="col-md-6 col-sm-12 mb-4" key={index}>
            <div className="card design-card p-3 shadow-lg">
              <div className="row align-items-center">
                {/* Image Column */}
                <div className="col-6 text-center">
                  <Image
                    alt={`Design ${index}`}
                    src={design.imageUrls?.[0] || "/placeholder.jpg"}
                    className="design-image img-fluid rounded"
                  />
                </div>
                {/* Content Column */}
                <div className="col-6 design-content">
                  <h5 className="design-heading">Design {index + 1}</h5>
                  <p><strong>Customer ID:</strong> {design.customerId}</p>
                  <p><strong>Category Group:</strong> {design.category_group_name}</p>
                  <p><strong>Design ID:</strong> {design.designId}</p>
                  <p><strong>Design Number:</strong> {design.Design?.designNo || "N/A"}</p>
                  <button className="btn btn-primary w-100 mt-2 feedback-btn" onClick={() => handleFeedback(design.designId)}>
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Album;
