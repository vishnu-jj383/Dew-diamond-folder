import { Button, Modal, Select, Image , Card} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";


const DesignBankTable = ({ setSelectedCount, isModalOpen, setIsModalOpen }) => {
  const [checked, setChecked] = useState(true);
  const [rows, setRows] = useState([]);
  const [customerrows, setCustomerRows] = useState([]);
  const[customer_email,setCustomer_email]=useState("")
  const[customer_id,setCustomer_id]=useState("")
  const[customer_name,setCustomer_name]=useState("")
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const API_URL = window.url + "design/getAllDesign";
  const CustomerAPI_URL =  window.url+"customer/getAllCustomers";
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/"); // Redirect if no auth token
      return;
    }

    const getCustomers = async () => {
      try {
        const response = await axios.get(CustomerAPI_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
       
        setCustomerRows(response.data.data || []);
       
      } catch (err) {
        setError(`Failed to fetch Order data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const getCustomersbyid = async (cusId) => {
      alert("customer id is " + cusId);  // For debugging
      try {
          const response = await axios.get(window.url + `customer/${cusId}`, {
              headers: {
                  Authorization: `Bearer ${savedToken}`,
              },
          });
          
          const customerData = response.data.data || {};
          alert("Customer email: " + customerData.customer_email);
          setCustomer_email(customerData.customer_email || "");
          setCustomer_id(customerData.id || "");
          setCustomer_name(customerData.customer_first_name || "");
         
      } catch (err) {
          setError("Failed to fetch customer data.");
          console.error(err);
          // alert("error");
      } finally {
          setLoading(false);
      }
  };

  // Check if sizeMM exists and fetch data
  if (selectedCustomer) {
    getCustomersbyid(selectedCustomer);  // Fetch based on sizeMM
  }

   

    const fetchOrders = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setRows(response.data.data || []);
        setFilteredRows(response.data.data || []);
      } catch (err) {
        setError(`Failed to fetch Order data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    getCustomers();
  }, [navigate,selectedCustomer]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const customers = [
  //   { label: "John Doe", value: "john_doe" },
  //   { label: "Jane Smith", value: "jane_smith" },
  //   { label: "Michael Johnson", value: "michael_johnson" },
  // ];
  
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Only prevent default if e is provided
    alert("handleSubmit");
  
    const savedToken = Cookies.get("authToken");
  
    if (!savedToken) {
      alert("Authentication token not found. Please log in.");
      return;
    }
  
    // if (!customer_name || !customer_email || !customer_id) {
    //   alert("Please select a customer.");
    //   return;
    // }
  
    if (selectedRows.length === 0) {
      alert("Please select at least one design.");
      return;
    }
  
    // Construct the payload
    const dataToSend = {
      customer: {
        customer_first_name: customer_name,
        customer_email: customer_email,
        id: customer_id,
      },
      designs: selectedRows.map((row) => ({
        id: row.id,
        createdAt: new Date().toLocaleDateString("en-GB"), // Example format
        designNo: row.designNo,
        imageUrls: row.imageUrls || [],
      })),
      designPageLink: `http://localhost:5173/album/${customer_id}`, // Update with the correct link if needed
    };
  
    console.log("Sending data:", JSON.stringify(dataToSend, null, 2));
  
    try {
      const response = await axios.post(
        window.url + "design/sendDesignEmail",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Designer Input Form Created Successfully!");
      navigate(`/album/${customer_id}`, { state: { customer_id } });
    } catch (error) {
      console.error(
        "Error creating Cad Designer:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error: " +
          (error.response ? JSON.stringify(error.response.data) : error.message)
      );
    }
  };

  const handleConfirm = () => {
    if (!selectedCustomer) {
      alert("Please select a customer before confirming.");
    } else {
      setIsModalOpen(false);
      console.log("Confirmed!");
      alert("working")
      handleSubmit();
    }

  };

  

  // Sample images
  const images = [
    "https://i.pinimg.com/736x/e3/20/39/e320392e9f9160484d2f2714ceca8e00.jpg",
    "https://i.pinimg.com/736x/6b/21/9a/6b219a4b7bc10241b3ffaaa415ed8a48.jpg",
  ];

  // const handleConfirm = () => {
  //   setIsModalOpen(false);
  //   console.log("Confirmed!");
  // };

  const handleRowSelection = (e, row) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, row]);
    } else {
      setSelectedRows((prev) => prev.filter(selectedRow => selectedRow.id !== row.id));
    }
  };
  React.useEffect(() => {
    setSelectedCount(selectedRows.length);
  }, [selectedRows, setSelectedCount]);

  const selectedRowsData = rows.filter(row => selectedRows.includes(row.id));
  return (
    <>
     <tbody>
        {currentRows.map((row) => (
          <tr key={row.id}>
            <td>
              <input
                type="checkbox"
                onChange={(e) => handleRowSelection(e, row)} // Passing row data directly
              />
            </td>
            <td>{row.designNo}</td>
            <td>{row.category}</td>
            <td>{row.subcategory}</td>
            <td>
              {Array.isArray(row.imageUrls) && row.imageUrls.length > 0 ? (
                <Image.PreviewGroup>
                  {row.imageUrls.map((img, index) => (
                    <Image key={index} src={img} width="60%" alt={`image-${index}`} />
                  ))}
                </Image.PreviewGroup>
              ) : row.imageUrls ? (
                <Image src={row.imageUrls} width="100%" alt="single-image" />
              ) : (
                <p>No Image Available</p>
              )}
            </td>
            <td>{row.productType}</td>
            <td>{row.expectedGrossWt}</td>
            <td>{row.brand}</td>
            <td>{row.metal}</td>
            <td>{row.metalColor}</td>
          </tr>
        ))}
      </tbody>

      {/* Modal for showing image and description */}
      <Modal
        title="Send Item To Customer"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
         <Button
         key="confirm"
         type="primary"
         onClick={handleConfirm}
         style={{
           background: selectedRows.length && selectedCustomer ? "#2a2f5b" : "#b0b0b0", // Change color based on the condition
           color: "#fff",
           cursor: selectedRows.length && selectedCustomer ? "pointer" : "not-allowed", // Change cursor based on the condition
         }}
         disabled={!selectedRows.length || !selectedCustomer} // Disable button if no rows selected or customer not selected
       >
         Confirm
       </Button>,
        ]}
      >
        <div style={{ textAlign: "center" }}>
          {/* Display selected rows as cards */}
          {selectedRows.map((row) => (
            <Card
              key={row.id}
              title={`Design No: ${row.designNo || "No Design No"}`} // Fallback text if undefined
              style={{ marginBottom: "10px", border: "1px solid #ddd" }}
            >
              <p><strong>Category:</strong> {row.category || "No Category"}</p>
              <Image.PreviewGroup>
                {Array.isArray(row.imageUrls) && row.imageUrls.length > 0 ? (
                  row.imageUrls.map((img, index) => (
                    <Image key={index} src={img} width="30%" alt={`image-${index}`} />
                  ))
                ) : (
                  <p>No Images Available</p>
                )}
              </Image.PreviewGroup>
            </Card>
          ))}

          {/* Customer Dropdown */}
          {/* <Select
            placeholder="Select a customer"
            style={{ width: "100%", marginTop: "10px" }}
            options={customers}
            onChange={setSelectedCustomer}
          /> */}
          <div className="form-group">
  <label htmlFor="customer">Customer</label>
  <select
    className="form-select pd-select"
    id="customer"
    value={selectedCustomer}
    onChange={(e) => {
      console.log("Selected Customer ID:", e.target.value);
      
      setSelectedCustomer(e.target.value);
    }}
  >
    <option value="">Select</option>
    {customerrows.length > 0 ? (
      customerrows.map((customer) => (
        <option key={customer.id} value={customer.id}>
          {customer.customer_first_name} {customer.customer_last_name}
        </option>
      ))
    ) : (
      <option disabled>No Customers Available</option>
    )}
  </select>
</div>
        </div>
      </Modal>

       {/* Pass data as props to the Album component */}
     
    </>
  );
};

export default DesignBankTable;
