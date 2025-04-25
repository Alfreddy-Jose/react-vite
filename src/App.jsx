import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/kaiadmin.min.css";
import "./styles/plugins.min.css";
import "./styles/styles.css";
import "./plugins/fontawesome/css/all.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./components/layouts/Sidebar";
import { AppRoutes } from "./routes/Routes";
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";
import Content from "./components/Content";

export function App() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <Router>
      <Content
        Sidebar={<Sidebar toggleSidebar={toggleSidebar} isSidebarMinimized={isSidebarMinimized} />}
        Navbar={<Navbar />}
        AppRoutes={<AppRoutes />}
        Footer={<Footer />}
        wrapperClass={isSidebarMinimized ? "sidebar_minimize" : ""}
      />
    </Router>
  );
}
