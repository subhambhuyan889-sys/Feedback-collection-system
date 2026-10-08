import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateForm from "./pages/CreateForm";
import MyForms from "./pages/MyForms";
import SubmitFeedback from "./pages/SubmitFeedback";
import Responses from "./pages/Responses";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import "./index.css";

const routes={"/":Login,"/login":Login,"/signup":Signup,"/dashboard":Dashboard,"/forms":MyForms,"/forms/new":CreateForm,"/feedback":SubmitFeedback,"/responses":Responses,"/analytics":Analytics,"/admin":AdminDashboard,"/profile":Profile,"/settings":Settings};
const App=()=>{const Page=routes[window.location.pathname]||Dashboard;return <Page/>};
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
