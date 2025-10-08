import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Alerta from "../components/Alert";
import { useLocation } from "react-router-dom";
import DashboardKpis from "../components/DashboardKpis";
import DisponibilidadDocentes from "../components/DisponibilidadDocentes";

export function Panel() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Motrar Alerta al iniciar sesión
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  return (
    <>
      <div className="container">
        <h2 className="my-4">📊 Dashboard</h2>
        <h6 className="op-7 mb-2">
          Bienvenido {user?.name} al Sistema de Información para la Gestión de
          Horarios
        </h6>
        <DashboardKpis />
        {/* Sección de Disponibilidad */}
        {/*         <DisponibilidadDocentes /> */}
      </div>
    </>
  );
}
