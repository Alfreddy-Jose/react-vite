import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./styles/kaiadmin.min.css";
import "./styles/plugins.min.css";
import "./styles/styles.css";
import "./plugins/fontawesome/css/all.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
