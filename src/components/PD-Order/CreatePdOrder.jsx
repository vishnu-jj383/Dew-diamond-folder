import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Footer from "../Footer";
import Header from "../Header";
import SideBar from "../SideBar";
import { useSelector } from "react-redux";
import {
  changeInputs,
  createPdOrder,
  getItemsFromApi,
  uploadImage,
} from "./services";
import moment from "moment";

const { Option } = Select;

const CreatePdOrder = () => {
  const sideBarState = useSelector((state) => state?.sidebar?.sideBar);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubtegories] = useState([]);
  const [file, setFile] = useState([]);

  const [pdFetchItems, setPdFetchItems] = useState([]);
  const [pdItems, setPdItems] = useState({
    promiseDate: "",
    orderDate: "",
    requiredDesignCount: null,
    customerId: null,
    productTypeId: null,
    genderId: null,
    categoryGroupId: null,
    categoryId: null,
    subcategoryId: null,
    brandId: null,
    styleId: null,
    occasionId: null,
    metalTypeId: null,
    metalColorId: null,
    status: "Pending",
    expectedGrossWt: null,
    expectedNetWt: null,
    remarks: "",
    diamondRange: "",
    colorStoneRange: "",
    priority: "",
    isItemReceived: "No",
  });

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await createPdOrder(pdItems);
      if (response?.data?.id) {
        const data = await uploadImage(file, response?.data?.id);
        if(data?.status === 200) {
          alert("Order created successfully")
          window.reload();
        }
      } else {
        console.error("Order creation failed, no ID returned.");
      }
    } catch (error) {
      console.error("An error occurred during the process:", error);
    }
  };

  useEffect(() => {
    getItemsFromApi(setPdFetchItems);
  }, []);

  useEffect(() => {
    changeInputs(
      setPdItems,
      pdItems,
      setSelectedCustomer,
      setCategories,
      setSubtegories
    );
  }, [pdItems?.customerId, pdItems?.categoryGroupId, pdItems?.categoryId]);

  useEffect(() => {
    if (selectedCustomer) {
      form.setFieldsValue({
        email: selectedCustomer.customer_email || "NIL",
        mobile: selectedCustomer.phone_number || "NIL",
        customerCode: selectedCustomer.id ? `CU${selectedCustomer.id}` : "",
        date: moment().format("YYYY-MM-DD"),
      });
      setPdItems((prev) => ({
        ...prev,
        orderDate: moment().format("YYYY-MM-DD"),
      }));
    }
  }, [selectedCustomer, form]);

  console.log("pd", pdItems);
  const handleChange = (value, option) => {
    setPdItems((prev) => ({
      ...prev,
      [option.name]: value,
    }));
  };

  const getInputValue = (e) => {
    const { name, value } = e.target;
    debugger;
    setPdItems((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      setPdItems((prev) => ({ ...prev, promiseDate: formattedDate }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file)
  };
  return (
    <div className={`wrapper ${sideBarState ? "sidebar_minimize" : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">PD/Concept</h3>
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
                  <a href="#">PD/Concept</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a href="#">Create PD</a>
                </li>
              </ul>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Customer"
                    name="customer"
                    rules={[
                      { required: true, message: "Please select customer" },
                    ]}
                  >
                    <Select
                      placeholder="Select Customer"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.customerData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="customerId"
                          >{`${item?.customer_first_name}`}</Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Email" name="email">
                    <Input
                      disabled
                      placeholder="Enter email"
                      value={selectedCustomer?.customer_email}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Mobile" name="mobile">
                    <Input
                      disabled
                      placeholder="Enter mobile number"
                      value={selectedCustomer?.phone_number}
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Customer Code" name="customerCode">
                    <Input
                      disabled
                      placeholder="Enter customer code"
                      value={
                        selectedCustomer ? `CU${selectedCustomer?.id}` : ""
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Date" name="date">
                    <Input disabled placeholder="Enter date" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Promised Date"
                    name="promisedDate"
                    rules={[
                      {
                        required: true,
                        message: "Please select promised date",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={handleDateChange}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Required Count"
                    name="requiredCount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter required count",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter required count"
                      onChange={getInputValue}
                      name="requiredDesignCount"
                      value={pdItems?.requiredDesignCount}
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Product Type"
                    name="productType"
                    rules={[
                      { required: true, message: "Please select product type" },
                    ]}
                  >
                    <Select
                      placeholder="Select product type"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.productTypeData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="productTypeId"
                          >
                            {item?.product_types}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Category Group"
                    name="categoryGroup"
                    rules={[
                      {
                        required: true,
                        message: "Please select category group",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select category group"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.categoryGroupData?.map((item) => (
                        <Option
                          key={item.id}
                          value={item.id}
                          name="categoryGroupId"
                        >
                          {item.category_group_name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      { required: true, message: "Please select category" },
                    ]}
                  >
                    <Select
                      placeholder="Select category"
                      onChange={handleChange}
                    >
                      {categories?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="categoryId"
                          >
                            {item?.category_name || "NO Data"}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Subcategory"
                    rules={[
                      { required: true, message: "Please select Subcategory" },
                    ]}
                  >
                    <Select
                      placeholder="Select Subcategory"
                      onChange={handleChange}
                    >
                      {subCategories?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="subcategoryId"
                          >
                            {item?.subcategory_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Brand"
                    name="brand"
                    rules={[{ required: true, message: "Please select brand" }]}
                  >
                    <Select placeholder="Select brand" onChange={handleChange}>
                      {pdFetchItems?.brandData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="brandId"
                          >
                            {item?.brand_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Style"
                    name="style"
                    rules={[{ required: true, message: "Please select style" }]}
                  >
                    <Select placeholder="Select style" onChange={handleChange}>
                      {pdFetchItems?.styleData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="styleId"
                          >
                            {item?.style_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Occasion"
                    name="occasion"
                    rules={[
                      { required: true, message: "Please select occasion" },
                    ]}
                  >
                    <Select
                      placeholder="Select occasion"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.occasionData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="occasionId"
                          >
                            {item?.occasion}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Metal Type"
                    name="metalType"
                    rules={[
                      { required: true, message: "Please select metal type" },
                    ]}
                  >
                    <Select
                      placeholder="Select metal type"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.materialTypeData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="metalTypeId"
                          >
                            {item?.material_class}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Metal Color"
                    name="metal color"
                    rules={[
                      { required: true, message: "Please select metal color" },
                    ]}
                  >
                    <Select
                      placeholder="Select metal color"
                      onChange={handleChange}
                    >
                      {pdFetchItems?.materialColorData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="metalColorId"
                          >
                            {item?.metal_color_name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      { required: true, message: "Please select gender" },
                    ]}
                  >
                    <Select placeholder="Select gender" onChange={handleChange}>
                      {pdFetchItems?.genderData?.map((item) => {
                        return (
                          <Option
                            key={item?.id}
                            value={item?.id}
                            name="genderId"
                          >
                            {item?.gender}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Expected Gross Weight"
                    name="grossWeight"
                    rules={[
                      { required: true, message: "Please enter gross weight" },
                    ]}
                  >
                    <Input
                      placeholder="Enter gross weight"
                      onChange={getInputValue}
                      name="expectedGrossWt"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Diamond Range"
                    rules={[
                      {
                        required: true,
                        message: "Please select diamond range",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter diamond range"
                      onChange={getInputValue}
                      name="diamondRange"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Color Stone Range"
                    name="colorRange"
                    rules={[
                      {
                        required: true,
                        message: "Please select Color Stone Range",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Color Stone Range"
                      onChange={getInputValue}
                      name="colorStoneRange"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Expected Net Weight"
                    name="netWeight"
                    rules={[
                      {
                        required: true,
                        message: "Please enter expected net.wt",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter net weight"
                      onChange={getInputValue}
                      name="expectedNetWt"
                      type="number"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Priority"
                    name="Priority"
                    rules={[
                      {
                        required: true,
                        message: "Please select Priority",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Priority"
                      onChange={handleChange}
                    >
                      <Option value="low" name="priority">
                        Low
                      </Option>
                      <Option value="high" name="priority">
                        High
                      </Option>
                      <Option value="high" name="priority">
                        High
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Choose Image File" name="image">
                    <input
                      type="file"
                      accept="image/*" // Limit file types to images
                      onChange={handleFileChange} // Handle the file change event
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Comment" name="comment">
                <Input.TextArea
                  rows={4}
                  placeholder="Enter your comment"
                  name="remarks"
                  onChange={getInputValue}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#2a2f5b" }}
                >
                  Submit
                </Button>
                <Button type="default" style={{ marginLeft: 8 }}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CreatePdOrder;
