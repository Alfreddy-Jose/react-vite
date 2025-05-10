import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/kaiadmin.min.css";
import "./styles/plugins.min.css";
import "./styles/styles.css";
import "./plugins/fontawesome/css/all.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";

export function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
