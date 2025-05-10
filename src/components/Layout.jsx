import React from "react";
import { Navbar } from "./layouts/Navbar";
import { Sidebar } from "./layouts/Sidebar";
import { Footer } from "./layouts/Footer";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <div className="container">
          <div className="page-inner">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
}
