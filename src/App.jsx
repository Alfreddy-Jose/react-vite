import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "./styles/kaiadmin.min.css";
import "./styles/styles.css";
import "./styles/plugins.min.css";
import "./plugins/fontawesome/css/all.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Sidebar } from "./components/layouts/Sidebar";
import { AppRoutes } from "./routes/Routes";
import { Navbar } from "./components/layouts/Navbar";
import { Footer } from "./components/layouts/Footer";

export function App() {
  return (
    <>
      <Router>
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="container">
            <div className="page-inner">
              <AppRoutes />
            </div>
          </div>
          <Footer></Footer>
        </div>
      </Router>
    </>
  );
}
