import React from "react";

export default function Layout({ Sidebar, Navbar, Footer, wrapperClass, children }) {
  return (
    <div className={`wrapper ${wrapperClass}`}> {/* Agregar clase dinámica */}
      {Sidebar}
      <div className="main-panel">
        {Navbar}
        <div className="container">
          <div className="page-inner">{children}</div>
        </div>
        {Footer}
      </div>
    </div>
  );
}
