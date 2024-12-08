import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/SideNavbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import CreateBlog from "./components/CreateBlog";
import './index.css'


const App = () => {
  return (
    <Router>
      <Content />
    </Router>
  );
};

const Content = () => {
  const location = useLocation();

  // Hide Navbar on login and signup pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}
      
      {/* Define routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/create-blog" element={<CreateBlog />} />
      </Routes>
    </>
  );
};

export default App;
