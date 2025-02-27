import React from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import Footer from "../Footer";
import SideBar from "../SideBar";
import Header from "../Header";
import { useSelector } from "react-redux";

const { Option } = Select;

const AddEmployee = () => {
  const sideBarState = useSelector(state => state?.sidebar?.sideBar)
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div className={`wrapper ${sideBarState ? 'sidebar_minimize' : ""}`}>
      <SideBar />
      <div className="main-panel">
        <Header />
        <div className="container">
          <div className="page-inner">
            <div className="page-header">
              <h3 className="fw-bold mb-3">Add Employee</h3>
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
                  <a href="#">Employees</a>
                </li>
                <li className="separator">
                  <i className="icon-arrow-right"></i>
                </li>
                <li className="nav-item">
                  <a href="#">Add Employee</a>
                </li>
              </ul>
            </div>

            {/* Employee Form */}
            <div className="card p-4">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="First Name"
                      name="firstname"
                      rules={[{ required: true, message: "Please enter first name" }]}
                    >
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastname"
                      rules={[{ required: true, message: "Please enter last name" }]}
                    >
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Subsidiary"
                      name="subsidiary"
                      rules={[{ required: true, message: "Please enter subsidiary" }]}
                    >
                      <Input placeholder="Enter subsidiary" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Designation"
                      name="designation"
                      rules={[{ required: true, message: "Please enter designation" }]}
                    >
                      <Input placeholder="Enter designation" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Role"
                      name="role"
                      rules={[{ required: true, message: "Please select a role" }]}
                    >
                      <Select placeholder="Select role">
                        <Option value="Admin">Admin</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Employee">Employee</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[{ required: true, message: "Please enter department" }]}
                    >
                      <Input placeholder="Enter department" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Mobile Number"
                      name="mobileno"
                      rules={[
                        { required: true, message: "Please enter mobile number" },
                        { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                      ]}
                    >
                      <Input placeholder="Enter mobile number" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter email" },
                        { type: "email", message: "Enter a valid email" },
                      ]}
                    >
                      <Input placeholder="Enter email" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" block style={{background: "#2a2f5b"}}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            {/* End Employee Form */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddEmployee;
