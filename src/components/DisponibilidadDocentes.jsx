import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FaChalkboardTeacher } from "react-icons/fa"; 

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DisponibilidadDocentes() {
  const [docentesTotales, setDocentesTotales] = useState(0);
  const [docentesAsignados, setDocentesAsignados] = useState(0);
  const [docentesDisponibles, setDocentesDisponibles] = useState(0);
  const [topDocentes, setTopDocentes] = useState([]);

  useEffect(() => {
    const total = 40;
    const asignados = 28;
    const disponibles = total - asignados;
    const top = [
      { nombre: "Pedro Pérez", horas: 18 },
      { nombre: "María López", horas: 16 },
      { nombre: "Carlos Díaz", horas: 15 },
    ];

    setDocentesTotales(total);
    setDocentesAsignados(asignados);
    setDocentesDisponibles(disponibles);
    setTopDocentes(top);
  }, []);

  const data = {
    labels: ["Asignados", "Disponibles"],
    datasets: [
      {
        data: [docentesAsignados, docentesDisponibles],
        backgroundColor: ["#dc3545", "#28a745"], // rojo - verde
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-primary text-white d-flex align-items-center">
        <FaChalkboardTeacher className="me-2" />
        <h5 className="mb-0">Disponibilidad de Docentes</h5>
      </div>
      <div className="card-body row">
        {/* Gráfico */}
        <div className="col-md-6 d-flex flex-column align-items-center">
          <Doughnut data={data} />
          <p className="mt-3">
            <strong>Total:</strong> {docentesTotales}
          </p>
        </div>
        {/* Lista Top Docentes */}
        <div className="col-md-6">
          <h6>Top Docentes con mayor carga:</h6>
          <ul className="list-group">
            {topDocentes.map((docente, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                {docente.nombre}
                <span className="badge bg-danger">{docente.horas}h</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
