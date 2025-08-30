import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./layouts/Navbar";
import { Sidebar } from "./layouts/Sidebar";
import { Footer } from "./layouts/Footer";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    // Espera a que el DOM esté realmente listo
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        // Re-inicializa los plugins de Kaiadmin y jQuery
        if (window.$) {
          // Scrollbars
          window.$(".sidebar .scrollbar").scrollbar && window.$(".sidebar .scrollbar").scrollbar();
          window.$(".main-panel .content-scroll").scrollbar && window.$(".main-panel .content-scroll").scrollbar();
          window.$(".messages-scroll").scrollbar && window.$(".messages-scroll").scrollbar();
          window.$(".tasks-scroll").scrollbar && window.$(".tasks-scroll").scrollbar();
          window.$(".quick-scroll").scrollbar && window.$(".quick-scroll").scrollbar();
          window.$(".message-notif-scroll").scrollbar && window.$(".message-notif-scroll").scrollbar();
          window.$(".notif-scroll").scrollbar && window.$(".notif-scroll").scrollbar();
          window.$(".quick-actions-scroll").scrollbar && window.$(".quick-actions-scroll").scrollbar();
          window.$(".dropdown-user-scroll").scrollbar && window.$(".dropdown-user-scroll").scrollbar();
          // Tooltips y popovers de Bootstrap
          if (window.bootstrap) {
            let tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltips].map(e => new window.bootstrap.Tooltip(e));
            let popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
            [...popovers].map(e => new window.bootstrap.Popover(e));
          }
        }
      }, 200); // Puedes probar con 200ms o más si tu menú es muy pesado
    });
    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="container">
            <div className="page-inner">{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
