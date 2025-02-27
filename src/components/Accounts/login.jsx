// import { Card, Input, Button, Form } from "antd";
import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import DashBoard from "../DashBoard";
import "../Accounts/Login.css"
import dewicon from "../Accounts/dew-icon.webp"
import { Card, Image, Button, Form, Input, Select } from "antd"; // Import Select component
const Login = () => {
  const [form] = Form.useForm();
  const url = import.meta.env.VITE_API_URL;
  const [warningMessage, setWarningMessage] = useState("");
  const handleSubmit = async (values) => {
    try {
      console.log("Form Values: ", values);
      const response = await axios.post(`${url}/auth/login`, {
        email: values.email,
        password: values.password,
      });
      console.log("Login response:", response.data.token);

      Cookies.set("authToken", response.data.token, { expires: 1 });

      window.location.reload(); 
    } catch (error) {
      if (error.response) {
        setWarningMessage(
           "Invalid login credentials"
          // `Error ${error.response.status}: ${
          //   "Invalid login credentials"
          // }`
        );
      } else if (error.request) {
        setWarningMessage("No response from server. Please try again.");
      } else {
        setWarningMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
  <div className="login-container">
    <div className="login-card">
      <div className="col-6 image-container">
        {/* <img
          alt="login illustration"
          src="https://i.pinimg.com/736x/8e/a0/31/8ea03185cfdc5d63b75988fa059e5ef0.jpg"
         
          className="login-image"
        /> */}
        <Image alt="Customer Design" src={dewicon} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="col-6 form-container">
        <Card hoverable className="card">
          <h3>Welcome Back</h3>
          {warningMessage && (
            <div className="alert alert-danger" role="alert">
              {warningMessage}
            </div>
          )}
          <Form
            form={form}
            name="login_form"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter Email" className="login-input" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password placeholder="Enter Password" className="login-input" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" block htmlType="submit" className="login-btn">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  </div>
</div>

  
  
  


  );
};

export default Login;
