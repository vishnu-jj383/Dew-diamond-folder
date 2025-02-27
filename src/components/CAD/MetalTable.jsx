import React, { useState } from "react";

function MetalTable({ rows }) {
  const [loading, setLoading] = useState(true);
  
  return (
    
            <div className="row">
              <div className="col-md-12">
                <div className="card">
               <center><h4>Color-Stone Materials</h4></center> 
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="display table table-striped table-hover">
                        <thead>
                        <tr>
          <th>Material Type</th>
          <th>Size</th>
          <th>caratWeight</th>
          <th>Piece</th>
          <th>Weight</th>
          <th>Action</th>
        </tr>
                        </thead>
                        <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td>{row.metalTypeId}</td>
            <td>{row.sizeMm}</td>
            <td>{row.grossWeight}</td>
            <td>{row.pieces}</td>
            <td>{row.grossWeight}</td>
          </tr>
        ))}
      </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div> 
            </div> 
         
  );
}

export default MetalTable;
