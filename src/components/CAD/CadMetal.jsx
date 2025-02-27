import React, { useEffect, useState } from 'react';
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import MetalTable from "./MetalTable";
import DiamondTable from './DiamondTable';
import GoldTable from './GoldTable';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import Cookies from 'js-cookie';
function CadMetal() {

  const [metalTable, setMetalTable] = useState([]); // Track selected metal types

  const [meterialType, setMeterialType] = useState("");
  const [number_of_Parts, setNumberof_Parts] = useState("");
  const [wight, setWeight] = useState("");
  
  const[Make_Type,setMakeType]=useState("")
  const [meterialTypelabel, setMeterialTypelabel] = useState("");
  const [classValue, setClassValue] = useState("");
  const [color, setColor] = useState("");
  const [diamondcolor, setDiamondColor] = useState("");
  const [purity, setPurity] = useState("");
  const [mgfpurity, setMgfPurity] = useState("");
  const [gram, setGram] = useState("");
  const [settingType, setSettingType] = useState("");
  const [sizeMM, setSizeMM] = useState("");
  const [sieveSize, setSieveSize] = useState("");
  const [caratWeight, setCaratWeight] = useState("");
  const [pieces, setPieces] = useState("");
  const [caratTotalWeight, setCaratTotalWeight] = useState("");
  const [sizeGroup, setSizeGroup] = useState("");
  const [sizeGroupid, setSizeGroupid] = useState("");  // this field is use for saving id in database
  const [quality, setQuality] = useState("");
  const [qualityGroup, setQualityGroup] = useState("");
  const [shape, setShape] = useState("");

  const [colorstone_qualityGroup, setColorstone_QualityGroup] = useState("");
  const [colorstone_quality, setColorstone_Quality] = useState("");
  const [colorstone_color, setColorstone_Color] = useState("");

   const navigate = useNavigate();
  
  const [rows, setRows] = useState([]);
  const [colorstone_rows, setColorStoneRows] = useState([]);
  const [diamond_rows, setDiamondRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [materialType_array, setMaterialType_array] = useState([]);
  const [makeType_array, setMakeTypeArray] = useState([]);

  const [settingTypes, setSettingTypes] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [sizeMMOptions, setSizeMMOptions] = useState([]);
  const [diamondcolor_Options, setDiamondColoroption] = useState([]);

  // color stone
  const [color_stonequalities, setColorStoneQualities] = useState([]);
  const [color_stonecolor_array, setColorStoneColor_Array] = useState([]);
// gold
const [material_class, setMeterialClass] = useState([]);
const [color_array, SetColorArray] = useState([]);
const [purity_array, setPurityArray] = useState([]);

const { customerId } = useParams();
 
const getMetalapidata_Url = window.url+"cad/getAssemblyItemsByCadId";

const MeratiType_Url = window.url+"materialItems/materialType";
const MakeType_Url = window.url+"materialItems/makeTypes";

  const API_URL = window.url+"cad/addAssemblyItem";
  const Setting_URL = window.url+"materialItems/settingType";
  const Quality_URL = window.url+"materialItems/diamondQuality";
  const Shape_URL = window.url+"materialItems/shapes";
  const Size_URL = window.url+"materialItems/diamondStoneSize";
  const diamondColor_URL = window.url+"materialItems/diamondColor";
  
  // color stone
  const ColorstoneQuality_URL = window.url+"materialItems/colorStoneQuality";
  const Colorstone_Color_URL = window.url+"materialItems/getAllColorStoneColors";
// gold
const MeterialClass_URL = window.url+"materialItems/metalClass";
const Color_URL = window.url+"materialItems/metalColor";
const Purity_URL = window.url+"materialItems/metalQuality";


// cad editfiled data for geting ids
const [cadNo, setCadNo] = useState("");
const [orderId, setOrderId] = useState("");
const [skitchid,setSkitchid]=useState("");

const Cad_Edit_Data_URL =  window.url+`cad/getCadById/${customerId}`;



    useEffect(() => {
        
        const savedToken = Cookies.get("authToken");

        if (!savedToken) {
            navigate("/");
            return;
        }

        const fetchCustomers = async () => {
            try {
                const response = await axios.get(Cad_Edit_Data_URL, {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                    },
                });

                const customerData = response.data.data || {};
                // alert(skitchid)
                setCadNo(customerData.id || "");
                setOrderId(customerData.orderId || "");
                setSkitchid(customerData.sketchId || "");
               

            } catch (err) {
                setError("Failed to fetch customer data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();

        

       
          if (!cadNo) return; // Prevent API call if cadNo is not set

    const getMetalapidata = async () => {
        setLoading(true);
        try {
            const requestData = { cadId: cadNo };
            const response = await axios.post(getMetalapidata_Url, requestData, {
                headers: {
                    Authorization: `Bearer ${savedToken}`,
                    "Content-Type": "application/json"
                }
            });

            const customerData = response.data.data || [];
            if (customerData.length > 0) {
              
                const firstItem = customerData[0];
                setNumberof_Parts(firstItem.numberOfParts || "");
                setWeight(firstItem.grossWeight || "");
                setMakeType(firstItem.makeTypeId || "");
            } else {
                console.warn("No data found in customerData array.");
            }
        } catch (err) {
            setError("Failed to fetch customer data.");
            console.error("Error fetching data:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    getMetalapidata();
    }, [navigate, customerId,cadNo]); // Added customerId dependency

  useEffect(() => {
    const savedToken = Cookies.get("authToken");
    if (!savedToken) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${API_URL}/`, {}, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        
        const orders = response.data.data || [];
        // alert(orders)
        setRows(orders);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    const getMetalType_Data = async () => {
      try {
        const response = await axios.get(MeratiType_Url, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setMaterialType_array(response.data.data || []);
        console.log(materialType_array);
      } catch (err) {
        console.error(`Failed to fetch setting types: ${err.message}`);
      }
    };

    const getMakeType_Data = async () => {
      try {
        const response = await axios.get(MakeType_Url, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setMakeTypeArray(response.data.data || []);
        
      } catch (err) {
        console.error(`Failed to fetch setting types: ${err.message}`);
      }
    };
    const getSettingData = async () => {
      try {
        const response = await axios.get(Setting_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setSettingTypes(response.data.data || []);
        console.log(settingTypes);
      } catch (err) {
        console.error(`Failed to fetch setting types: ${err.message}`);
      }
    };

    const getQualityData = async () => {
      try {
        const response = await axios.get(Quality_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setQualities(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch quality data: ${err.message}`);
      }
    };

    const getShapeData = async () => {
      try {
        const response = await axios.get(Shape_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setShapes(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };
    const getDiamondColorData = async () => {
      try {
        const response = await axios.get(diamondColor_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setDiamondColoroption(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch quality data: ${err.message}`);
      }
    };

    const getSizeData = async () => {
      try {
        const response = await axios.get(Size_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setSizeMMOptions(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };

    const getColorStoneQualityData = async () => {
      try {
        const response = await axios.get(ColorstoneQuality_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setColorStoneQualities(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch quality data: ${err.message}`);
      }
    };

    const getClassData = async () => {
      try {
        const response = await axios.get(MeterialClass_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setMeterialClass(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };

    const getColorData = async () => {
      try {
        const response = await axios.get(Color_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        SetColorArray(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };

    const getPurityData = async () => {
      try {
        const response = await axios.get(Purity_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setPurityArray(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };

    const getColorStoneColorData = async () => {
      try {
        const response = await axios.get(Colorstone_Color_URL, {
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        setColorStoneColor_Array(response.data.data || []);
      } catch (err) {
        console.error(`Failed to fetch shapes data: ${err.message}`);
      }
    };

    fetchOrders();
    getMetalType_Data();
    getMakeType_Data();
    getSettingData();
    getQualityData();
    getShapeData();
    getDiamondColorData();
   
    getSizeData();
  
    getColorStoneQualityData();
    getClassData();
    getColorData();
    getPurityData();
    getColorStoneColorData();

  
  }, [navigate]);
  const handlePurityChange = (e) => {
    const selectedId = e.target.value;
    setPurity(selectedId);
  
    // Find the corresponding quality_mfg_clarity based on the selected ID
    const selectedPurity = purity_array.find((type) => type.id.toString() === selectedId);
    
    if (selectedPurity) {
      setMgfPurity(selectedPurity.quality_mfg_clarity);
    } else {
      setMgfPurity(""); // Reset if no match is found
    }
  };

 
  useEffect(() => {
    const savedToken = Cookies.get("authToken");

    if (!savedToken) {
        navigate("/");  // Redirect to login if no token
        return;
    }

    // Define the function to fetch data
    const fetchCustomers = async (sizeMMId) => {
        // alert(sizeMMId);  // For debugging
        try {
            const response = await axios.get(window.url + `materialItems/getSieve/${sizeMMId}`, {
                headers: {
                    Authorization: `Bearer ${savedToken}`,
                },
            });

            const customerData = response.data.data || {};
            setSieveSize(customerData.sieveSize || "");
            setCaratWeight(customerData.stoneWeight || "");
            setSizeGroup(customerData.diamondStoneSize?.diamondSizeGroup?.diamond_size_group || "");
            setSizeGroupid(customerData.diamondStoneSize?.diamondSizeGroup?.diamond_size_group_id || "")
        } catch (err) {
            setError("Failed to fetch customer data.");
            console.error(err);
            // alert("error");
        } finally {
            setLoading(false);
        }
    };

    // Check if sizeMM exists and fetch data
    if (sizeMM) {
        fetchCustomers(sizeMM);  // Fetch based on sizeMM
    }

}, [navigate, sizeMM]);  // Added sizeMM as a dependency


// quantity group value displaye code
const handleQualityChange = (e) => {
  const selectedQualityId = e.target.value;
  setQuality(selectedQualityId);

  // Find the corresponding quality group based on selected quality
  const selectedQuality = qualities.find(q => q.id === parseInt(selectedQualityId));
  if (selectedQuality) {
    setQualityGroup(selectedQuality.diamond_quality_group); // Update the text box with the corresponding quality group
  } else {
    setQualityGroup(''); // Clear if no quality is selected
  }
};


// quantity group value displaye code
const handleColorStoneQualityChange = (e) => {
  const selectedQualityId = e.target.value;
 setColorstone_Quality(selectedQualityId);

  // Find the corresponding quality group based on selected quality
  const selectedQuality = color_stonequalities.find(q => q.id === parseInt(selectedQualityId));
  if (selectedQuality) {
   
    setColorstone_QualityGroup(selectedQuality.stone_quality_group); // Update the text box with the corresponding quality group
  } else {
    
    setColorstone_QualityGroup(''); // Clear if no quality is selected
  }
};

// total carateweight code
useEffect(() => {
  // Calculate Carat Total Weight whenever caratWeight or pieces changes
  if (caratWeight && pieces) {
    setCaratTotalWeight(parseFloat(caratWeight) * parseInt(pieces));
  } else {
    setCaratTotalWeight(''); // Clear if any field is empty
  }
}, [caratWeight, pieces]);
  
const handleChangeMeterialtype = (e) => {
  const selectedId = e.target.value; // Get the selected id
  setMeterialType(selectedId); // Update the id state

  // Find the corresponding label (material_class) based on the selected id
  const selectedItem = materialType_array.find(type => type.id === selectedId);
  if (selectedItem) {
    setMeterialTypelabel(selectedItem.material_class); // Update the label state
  }
};
// post data code


  const handleSubmit = async (e) => {
    e.preventDefault();
  

    const savedToken = Cookies.get("authToken");

    // Create the data object with the necessary fields (e.g., id)
    const dataToSend = {
      cadId:cadNo,
      sketchId:skitchid,
      orderId:orderId,
      numberOfParts:parseInt(number_of_Parts),
      makeTypeId:parseInt(Make_Type),
      weight:wight,
      materialInformation:rows


    };

    console.log("Sending data:", dataToSend); // Debugging log

    try {
      const response = await axios.post(
        window.url + "cad/addAssemblyItem",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Material Input Form Created: " + JSON.stringify(response.data));
      navigate("/cadlist");
    } catch (error) {
      console.error(
        "Error creating customer:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error: " +
          (error.response ? JSON.stringify(error.response.data) : error.message)
      );
    }
  };
  const handleAddMetal = () => {
    // alert(meterialTypelabel)
    const newRow = {
     
      metalTypeId:parseInt(meterialType),  // materialType is the selected material type (e.g., "Gold", "Diamond")
      metalClassId:parseInt(classValue),    // Class selected
      metalColorId:parseInt(color),         // Color selected
      metalQualityId:parseInt(purity),        // Purity selected
      gram:parseInt(gram),
      
      DiamondColorId:parseInt(diamondcolor),  // materialType is the selected material type (e.g., "Gold", "Diamond")
      diamondSizegroupId:parseInt(sizeGroupid),
      diamondStoneSizeId:parseInt(sizeMM),    // Class selected
      DiamondQualityGroupId:parseInt(qualityGroup),         // Color selected
      DiamondQualityId:parseInt(quality),  
      colorStoneColorId:parseInt(colorstone_color),
      colorStoneQualityGroupId:parseInt(colorstone_qualityGroup),
      colorStoneQualityId:parseInt(colorstone_quality),
      shapesId:parseInt(shapes), 
      sieveId:parseInt(sieveSize),
      pieces:parseInt(pieces),
      

      grossWeight:parseInt(caratWeight)
    };
  
    // Add the new row to the rows state
    if(parseInt(meterialType)==3){
      setRows([...rows, newRow]);
      if (!setMetalTable.includes(parseInt(meterialType)) && parseInt(meterialType) > 0) {
        setMetalTable([...metalTable, parseInt(meterialType)]);
      }
    }
    else if(parseInt(meterialType)==2){
      setDiamondRows([...diamond_rows, newRow]);
      if (!setMetalTable.includes(parseInt(meterialType)) && parseInt(meterialType) > 0) {
        setMetalTable([...metalTable, parseInt(meterialType)]);
      }
    }
    else if(parseInt(meterialType)==1){
      setColorStoneRows([...colorstone_rows, newRow]);
      if (!setMetalTable.includes(parseInt(meterialType)) && parseInt(meterialType) > 0) {
        setMetalTable([...metalTable, parseInt(meterialType)]);
      }
    }
    
  };

  return (
    <div className="wrapper">
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <ul className="breadcrumbs mb-3">
                
              </ul>
            </div>
            <div className="card">
              <div className="card-header text-white">
                <center>
                  <h5 style={{ color: "black" }}>Metal Information</h5>
                </center>
              </div>
              <div className="card-body">
              <div className="row">
              <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="sieveSize">Number of Parts</label>
                      <input
                        type="text"
                        className="form-control"
                        id="sieveSize"
                        placeholder="Enter Sieve Size"
                        value={number_of_Parts}
                        onChange={(e) => setNumberof_Parts(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="sieveSize">Weight</label>
                      <input
                        type="text"
                        className="form-control"
                        id="sieveSize"
                        placeholder="Enter Weight"
                        value={wight}
                        onChange={(e) => setWeight(e.target.value)}
                        
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="materialType">Make Type</label>
                     
                      <select
                        className="form-select pd-select"
                        id="settingType"
                        value={Make_Type}
                       
                          // onChange={(e) => setMeterialType(e.target.value)}
                          onChange={(e) => {
                            console.log("Selected Value:", e.target.value); // Debugging
                            // alert(Make_Type)
                             
                            setMakeType(e.target.value);
                          }}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {makeType_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.make_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
              
                </div>
                </div>
                </div>
            <div className="card">
              <div className="card-header text-white">
                <center>
                  <h5 style={{ color: "black" }}>Material Input Form</h5>
                </center>
              </div>
              <div className="card-body">
              
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="materialType">Material Type</label>
                      {/* <select
                        className="form-select pd-select"
                        id="materialType"
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Gold">Gold</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Color Stone">Color Stone</option>
                      </select> */}
                      <select
                        className="form-select pd-select"
                        id="settingType"
                        value={meterialType}
                       
                          // onChange={(e) => setMeterialType(e.target.value)}
                          onChange={(e) => {
                            console.log("Selected Value:", e.target.value); // Debugging
                            // alert(meterialType)
                             
                            setMeterialType(e.target.value);
                          }}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {materialType_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.material_class}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                </div>
               
                {/* Gold Section */}
                {meterialType == 3 && (
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="class">Class *</label>
                      
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={classValue}
                          onChange={(e) => setClassValue(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {material_class.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.metal_class}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="color">Color *</label>
                        
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {color_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.metal_color_name}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="purity">Purity *</label>
                      <select
                        className="form-select pd-select"
                        id="settingType"
                        value={purity}
                        onChange={handlePurityChange}
                      >
                        <option value="" style={{ color: "#000" }}>Select</option>
                        {purity_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.metal_quality}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="sieveSize">MFG Purity</label>
                      <input
                        type="text"
                        className="form-control"
                        id="sieveSize"
                        placeholder="Enter Sieve Size"
                        value={mgfpurity}
                        readOnly // Prevent manual input
                      />
                    </div>
                  </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="gram">Gram *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="gram"
                          placeholder="Enter Gram Value"
                          value={gram}
                          onChange={(e) => setGram(e.target.value)}
                        />
                      </div>
                    </div>
                   
                  </div>
                )}

                {/* Diamond Section */}
                {meterialType == 2 && (
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="settingType">Setting Type *</label>
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={settingType}
                        onChange={(e) => setSettingType(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {settingTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.settingType}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Size MM *</label>
                        <select
                        className="form-select pd-select"
                        id="sizeMM"
                        value={sizeMM}
                        onChange={(e) => setSizeMM(e.target.value)}
                      >
                        <option value="" style={{ color: "#000" }}>Select</option>
                        {sizeMMOptions
                          .filter((option) => option.material_type === "Diamond")
                          .map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.sizeMm}
                            </option>
                          ))}
                      </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Sieve Size *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="sieveSize"
                            placeholder="Enter Sieve Size"
                            value={sieveSize}
                            readOnly
                          />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Carat Wight*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={caratWeight}
                          onChange={(e) => setSieveSize(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Pieces *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Pieces"
                          value={pieces}
                          onChange={(e) => setPieces(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Carat total weight *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          
                          value={caratTotalWeight}
                          onChange={(e) => setCaratTotalWeight(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="settingType">Color *</label>
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={diamondcolor}
                        onChange={(e) => setDiamondColor(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {diamondcolor_Options.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.diamond_color}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Size Group*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={sizeGroup}
                          onChange={(e) => setSizeGroup(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Quality *</label>
                        <select
            className="form-select pd-select"
            id="quality"
            value={quality}
            onChange={handleQualityChange}
          >
            <option value="" style={{ color: '#000' }}>Select</option>
            {qualities.map((quality) => (
              <option key={quality.id} value={quality.id}>
                {quality.diamond_quality}
              </option>
            ))}
          </select>

                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Quality Group*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={qualityGroup}
                          onChange={(e) => setQualityGroup(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Shape *</label>
                        <select
                            className="form-select pd-select"
                            id="shape"
                            value={shape}
                            onChange={(e) => setShape(e.target.value)}
                          >
                            <option value="">Select</option>
                            {shapes
                               .filter((shapeItem) => shapeItem.material_class === "Diamond")
                              .map((shapeItem) => (
                                <option key={shapeItem.id} value={shapeItem.id}>
                                  {shapeItem.shape_name}
                                </option>
                              ))}
                          </select>
                      </div>
                    </div>
                  </div>
                  

                  
                )}

{/* Color_Stone Section */}
{meterialType == 1 && (
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="settingType">Shape *</label>
                        <select
                            className="form-select pd-select"
                            id="shape"
                            value={shape}
                            onChange={(e) => setShape(e.target.value)}
                          >
                            <option value="">Select</option>
                            {shapes
                              .filter((shapeItem) => shapeItem.material_class === "Color Stone")
                              .map((shapeItem) => (
                                <option key={shapeItem.id} value={shapeItem.id}>
                                  {shapeItem.shape_name}
                                </option>
                              ))}
                          </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Size MM *</label>
                        {/* <select
                          className="form-select pd-select"
                          id="sizeMM"
                          value={sizeMM}
                          onChange={(e) => setSizeMM(e.target.value)}
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select> */}
                        <select
                      className="form-select pd-select"
                      id="sizeMM"
                      value={sizeMM}
                      onChange={(e) => setSizeMM(e.target.value)}
                    >
                      <option value="" style={{ color: '#000' }}>Select</option>
                      {sizeMMOptions.filter(option => option.material_type === "Diamond").map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.sizeMm} {/* Displaying the sizeMm property */}
                        </option>
                      ))}
                    </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Color</label>
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={colorstone_color}
                        onChange={(e) => setColorstone_Color(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {color_stonecolor_array.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.colorstone_color}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Quality *</label>
                        {/* <select
                          className="form-select pd-select"
                          id="quality"
                          value={quality}
                          onChange={(e) => setColorStoneQualities(e.target.value)}
                        >
                          <option value="" style={{ color: '#000' }}>Select</option>
                          {qualities.map((quality) => (
                            <option key={quality.id} value={quality.id}>
                              {quality.stone_quality}
                            </option>
                          ))}
                        </select> */}
                        <select
                        className="form-select pd-select"
                        id="quality"
                        value={colorstone_quality}
                        onChange={handleColorStoneQualityChange}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {color_stonequalities.map((quality) => (
                          <option key={quality.id} value={quality.id}>
                            {quality.stone_quality}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Pieces *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={pieces}
                          onChange={(e) => setPieces(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sizeMM">Setting Type *</label>
                        <select
                        className="form-select pd-select"
                        id="settingType"
                        value={settingType}
                        onChange={(e) => setSettingType(e.target.value)}
                      >
                        <option value="" style={{ color: '#000' }}>Select</option>
                        {settingTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.settingType}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Carat Wight*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={caratWeight}
                          onChange={(e) => setSieveSize(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Carat total weight *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={caratTotalWeight}
                          onChange={(e) => setCaratTotalWeight(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Sieve Size*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          placeholder="Enter Sieve Size"
                          value={sieveSize}
                          onChange={(e) => setSieveSize(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Size Group*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          // placeholder="Enter Sieve Size"
                          value={sizeGroup}
                          onChange={(e) => setSizeGroup(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="sieveSize">Quality Group*</label>
                        <input
                          type="text"
                          className="form-control"
                          id="sieveSize"
                          
                          value={colorstone_qualityGroup}
                          onChange={(e) => setColorstone_QualityGroup(e.target.value)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}

                <br />
                <center>
                  <div className="card-action">
                    <button className="btn btn-info"  onClick={handleAddMetal}>Add Metal</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-danger">Cancel</button>
                  </div>
                </center>
                <MetalTable rows={colorstone_rows} />
                <DiamondTable rows={diamond_rows} />
                <GoldTable rows={rows} />
                {/* <div style={{ display: meterialType == 1 ? "block" : "none" }}>
    <MetalTable rows={rows} />
  </div>
  <div style={{ display: meterialType == 2 ? "block" : "none" }}>
    <DiamondTable rows={rows} />
  </div>
  <div style={{ display: meterialType == 3 ? "block" : "none" }}>
    <GoldTable rows={rows} />
  </div> */}
              </div>
              <center>
                  <div className="card-action">
                    <button className="btn btn-info"  onClick={handleSubmit}>Save</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {/* <button className="btn btn-danger">Cancel</button> */}
                  </div>
                </center>
             
            </div>
          
          </div>
          
        </div>
       
        <Footer />
      </div>
    </div>
  );
}

export default CadMetal;
