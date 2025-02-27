import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import DashBoard from "./components/DashBoard";
import DataTable from "./components/DataTable";
import CreatePdOrder from "./components/PD-Order/CreatePdOrder";
import ApprovalLists from "./components/PD-Order/ApprovalLists";
import SketchApproval from "./components/Sketches/ApprovalLists";
import PdLists from "./components/PD-Order/PdLists";
import SketchList from "./components/Sketches/SketchList";
import SketchGridView from "./components/Sketches/SketchGridView";
import EditSkitch from "./components/Sketches/EditSkitch";


import DesignReports from "./components/Reports/DesignReports/DesignReports";
import DesignerReports from "./components/Reports/DesignerReports/DesignerReports";
import FeedbackList from "./components/Reports/Feedback/FeedbackList";


import SentToCustomer from "./components/Albums/SendToCustomer/SentToCustomer";
import DewAlbums from "./components/Albums/DewAlbums/DewAlbums";
import DewAlbumDetail from "./components/Albums/DewAlbums/DewAlbumDetail";
import AddEmployee from "./components/Employees/AddEmployee";
import EmployeeList from "./components/Employees/EmployeeList";

import DesignBank from "./components/Design/DesignBank/DesignBank";
import DesignMaster from "./components/Design/DesignMaster/DesignMaster";
import Album from "./components/Design/DewAlbum/Album";
import Feedback from "./components/Design/DewAlbum/Feedback";

import CadList from "./components/CAD/CadList";
import CadApprovalList from "./components/CAD/CadApprovalList";
import EditCad from "./components/CAD/EditCad";
import CadMetal from "./components/CAD/CadMetal";
import GetDesignerList from "./components/CAD/GetDesignerList";
import EditDesigner from "./components/CAD/EditDesigner";

import RenderList from "./components/Render/RenderList";
import RenderApprovalList from "./components/Render/RenderApprovalList";
import EditRender from "./components/Render/EditRender";
import RenderDesignerList from "./components/Render/RenderDesignerList";
import RenderDesignEdit from "./components/Render/RenderDesignEdit";

import CreateCustomer from "./components/Customers/CreateCustomer";
import ListCustomer from "./components/Customers/ListCustomer";
import EditCustomer from "./components/Customers/EditCustomer";

import { Provider } from "react-redux";
import store from "./store/store";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Login from "./components/Accounts/login";

function App() {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedToken = Cookies.get("authToken");
    setToken(fetchedToken);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = Cookies.get("authToken");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isTokenValid = token && token !== "undefined" && token.trim() !== "";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isTokenValid ? <DashBoard /> : <Login />,
    },
    {
      path: "/dataTable",
      element: isTokenValid ? <DataTable /> : <Login />,
    },
    {
      path: "/createOrder",
      element: isTokenValid ? <CreatePdOrder /> : <Login />,
    },
    {
      path: "/approvalLists",
      element: isTokenValid ? <ApprovalLists /> : <Login />,
    },
    {
      path: "/pdLists",
      element: isTokenValid ? <PdLists /> : <Login />,
    },
    {
      path: "/sketchList",
      element: isTokenValid ? <SketchList /> : <Login />,
    },
    {
      path: "/sketchApproval",
      element: isTokenValid ? <SketchApproval /> : <Login />,
    },
    {
      path: "/sketchGridView",
      element: isTokenValid ? <SketchGridView /> : <Login />,
    },
    {
      path: "/edit/:id",
      element: isTokenValid ? <EditSkitch /> : <Login />,
    },
    {
      path: "/cadlist",
      element:isTokenValid ?<CadList />: <Login /> ,
    },
    {
      path: "/cad_approval_list",
      element: isTokenValid ? <CadApprovalList /> : <Login />,
    },
    {
      path: "/cad_edit/:customerId",
      element: isTokenValid ? <EditCad /> : <Login />,
    },
    {
      path: "/cad_metal/:customerId",
      element: isTokenValid ? <CadMetal /> : <Login />,
    },
    {
      path: "/cad_designer/:orderId",
      element: isTokenValid ? <GetDesignerList /> : <Login />,
    },
    {
      path: "/designer_edit/:designerId",
      element: isTokenValid ? <EditDesigner /> : <Login />,
    },

    {
      path: "/render_list",
      element:isTokenValid ?<RenderList /> : <Login /> ,
    },
    {
      path: "/renderApproval__list",
      element: isTokenValid ? <RenderApprovalList /> : <Login />,
    },
    {
      path: "/render_edit/:renderId",
      element: isTokenValid ? <EditRender /> : <Login />,
    },
    {
      path: "/render_designer/:orderId",
      element: isTokenValid ? <RenderDesignerList /> : <Login />,
    },


    {
      path: "/render_designer_edit/:designerId",
      element: isTokenValid ? <RenderDesignEdit /> : <Login />,
    },


    {
      path: "/customer__list",
      element: isTokenValid ? <ListCustomer /> : <Login />,
    },
    {
      path: "/edit-customer/:customerId",
      element: isTokenValid ? <EditCustomer /> : <Login />,
    },
    {
      path: "/create_customer",
      element: isTokenValid ? <CreateCustomer /> : <Login />,
    },



    {
      path: "/designReports",
      element: isTokenValid ? <DesignReports /> : <Login />,
    },
    {
      path: "/designerReports",
      element: isTokenValid ? <DesignerReports /> : <Login />,
    },
    {
    path: "/feedbacklist",
    element: isTokenValid ? <FeedbackList /> : <Login />,
  },
    {
      path: "/sentToCustomer",
      element: isTokenValid ? <SentToCustomer /> : <Login />,
    },
    {
      path: "/dewAlbum",
      element: isTokenValid ? <DewAlbums /> : <Login />,
    },
    {
      path: "dewAlbum/:id",
      element: isTokenValid ? <DewAlbumDetail /> : <Login />,
    },
    {
      path: "/addEmployee",
      element: isTokenValid ? <AddEmployee /> : <Login />,
    },
    {
      path: "/employeeLists",
      element: isTokenValid ? <EmployeeList /> : <Login />,
    },
    {
      path: "/designBank",
      element: isTokenValid ? <DesignBank /> : <Login />,
    },
    {
      path: "/designMaster",
      element: isTokenValid ? <DesignMaster /> : <Login />,
    },
    {
      path: "/album/:customer_id",
      element: isTokenValid ? <Album /> : <Login />,
    },
    {
      path: "/feedback/:customer_id",
      element: isTokenValid ? <Feedback /> : <Login />,
    },
  ]);

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
