import React from "react";
import { FaEye } from "react-icons/fa";

const DesignMasterTable = () => {
  return (
    <tr>
      <td>
        <FaEye className="text-primary" />
      </td>
      <td>D-104</td>
      <td>12 Feb 2025</td>
      <td>
        <img
          src="https://i.pinimg.com/736x/92/93/f2/9293f25b1f67d2636be610094c622cc7.jpg"
          alt="Sketch"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      </td>
      <td>Manufacture</td>
      <td>Chain</td>
      <td>Ornament</td>
      <td>Necklace</td>
      <td>19</td>
      <td>Diamond</td>
    </tr>
  );
};

export default DesignMasterTable;
