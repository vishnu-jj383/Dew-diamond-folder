import React, { useState } from "react";
import { FaEllipsisV, FaEye } from "react-icons/fa";

const SketchListTable = () => {
  const [toggle, setToggle] = useState(false);

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
      <td>c-108</td>
      <td>2</td>
      <td>1</td>
      <td>Abhijith</td>
      <td>Approved</td>
      <td>13 Feb 2025</td>
      <td>5</td>
      <td style={{ position: "relative" }} onClick={() => setToggle(!toggle)}>
        {!toggle && (
          <FaEllipsisV
            className="text-secondary"
            style={{ cursor: "pointer" }}
          />
        )}
        {toggle && (
          <span
            className="pd-edit-btn"
            style={{
              position: "relative",
              top: "0px",
              right: "19px",
              background: "#2a2f5b",
              color: "white",
              padding: "7px 4px",
              cursor: "pointer",
            }}
          >
            Edit
          </span>
        )}
      </td>
    </tr>
  );
};

export default SketchListTable;
