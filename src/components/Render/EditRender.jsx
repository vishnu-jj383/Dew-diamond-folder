import React, { useState, useEffect } from 'react';
import axios from "axios";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useNavigate, useParams } from "react-router";
import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
function EditRender() {
    const { renderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
     const sideBarState = useSelector(state => state?.sidebar?.sideBar)
    // State variables for render details
    const [id, setId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [renderBriefDate, setRenderBriefDate] = useState("");
    const [renderCompletedDate, setRenderCompletedDate] = useState("");
    const [reqRenderCount, setReqRenderCount] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    
    const API_URL =  window.url+`render/getRenderById/${renderId}`;

    useEffect(() => {
        const savedToken = Cookies.get("authToken");
        if (!savedToken) {
            navigate("/");
            return;
        }

        const fetchRenderDetails = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: { Authorization: `Bearer ${savedToken}` },
                });
                const renderData = response.data.data || {};
                
                setId(renderData.id || "");
                setOrderId(renderData.orderId || "");
                setRenderBriefDate(renderData.renderBriefDate || "");
                setRenderCompletedDate(renderData.renderCompletedDate || "");
                setReqRenderCount(renderData.reqRenderCount || "");
                setSpecialInstructions(renderData.specialInstructions || "");
            } catch (err) {
                setError("Failed to fetch render data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRenderDetails();
    }, [navigate, renderId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const savedToken = Cookies.get("authToken");
        if (!savedToken) {
            alert("Authorization token not found.");
            return;
        }

        try {
            const response = await axios.put(
                 window.url+`render/updateRender/${renderId}`,
                {
                    order_id: orderId,
                    render_brief_date: renderBriefDate,
                    render_completed_date: renderCompletedDate,
                    req_render_count: reqRenderCount,
                    special_instructions: specialInstructions,
                },
                {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Render Updated: " + JSON.stringify(response.data));
            navigate("/render_list");
        } catch (error) {
            console.error("Error updating render:", error);
            alert("Error updating render.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
        <SideBar />
        <div className="main-panel">
            <Header />
            <div className="container">
                <div className="page-inner">
                    <div className="page-header">
                        {/* <h5>Edit Render</h5> */}
                    </div>
                    <div className="card">
                        {/* Card Header */}
                        <div className="card-header">
                          <center><h6>Edit Render </h6></center>  
                        </div>
                        
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Order ID */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Render ID</label>
                                            <input type="text" className="form-control" value={id} onChange={(e) => setOrderId(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Concept ID</label>
                                            <input type="text" className="form-control" value={orderId} onChange={(e) => setOrderId(e.target.value)} required />
                                        </div>
                                    </div>

                                    
    
                                    {/* Render Brief Date */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <input type="date" className="form-control" value={renderBriefDate} onChange={(e) => setRenderBriefDate(e.target.value)} required />
                                        </div>
                                    </div>
                                </div>
    
                                <div className="row">
                                    {/* Render Completed Date */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Render Completed Date</label>
                                            <input type="date" className="form-control" value={renderCompletedDate} onChange={(e) => setRenderCompletedDate(e.target.value)} required />
                                        </div>
                                    </div>
    
                                    {/* Requested Render Count */}
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Requested Render Count</label>
                                            <input type="number" className="form-control" value={reqRenderCount} onChange={(e) => setReqRenderCount(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Designer Name</label>
                                            <input type="number" className="form-control"   />
                                        </div>
                                    </div>
                                </div>
    
                                {/* Special Instructions */}
                                <div className="form-group">
                                    <label>Special Instructions</label>
                                    <textarea className="form-control" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} required />
                                </div>
    
                                {/* Buttons */}
                                <br></br>
                                <center>
                                <button type="submit" className="btn btn-info">Submit</button>&nbsp;&nbsp;&nbsp;
                                <button type="button" className="btn btn-danger" onClick={() => navigate("/renders")}>Cancel</button>
                                </center>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </div>
    
    );
}

export default EditRender;
