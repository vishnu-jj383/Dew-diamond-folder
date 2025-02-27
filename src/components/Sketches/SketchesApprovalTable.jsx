import React, { useState } from "react";
import { FaEllipsisV, FaEye } from "react-icons/fa";

const SketchesApprovalTable = () => {
  const [approvalStatus, setApprovalStatus] = useState("Approved");
  const [moveToCad, setMoveToCad] = useState("moveToCad")
  return (
    <tr>
      <td>
        <FaEye className="text-primary" />
      </td>
      <td>sk-140</td>
      <td>10 Feb 2025</td>
      <td>
        <img
          src="https://i.pinimg.com/736x/92/93/f2/9293f25b1f67d2636be610094c622cc7.jpg"
          alt="Sketch"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      </td>
      <td>2</td>
      <td>C-112</td>
      <td>Abhijith</td>
      <td>
        <select
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
          className="form-select"
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Initiated">Initiated</option>
        </select>
      </td>
      <td>
        <button className="cad-btn">Move to Cad</button>
      </td>
    </tr>
  );
};

export default SketchesApprovalTable;
