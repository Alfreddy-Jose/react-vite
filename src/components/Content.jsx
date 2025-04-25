import React from "react";

export default function Content({ Sidebar, Navbar, AppRoutes, Footer, wrapperClass }) {
  return (
    <div className={`wrapper ${wrapperClass}`}> {/* Agregar clase dinámica */}
      {Sidebar}
      <div className="main-panel">
        {Navbar}
        <div className="container">
          <div className="page-inner">{AppRoutes}</div>
        </div>
        {Footer}
      </div>
    </div>
  );
}
