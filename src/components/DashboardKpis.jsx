// src/components/DashboardKpis.jsx
import { useEffect, useState } from "react";
import Api from "../services/Api";

export default function DashboardKpis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const res = await Api.get("/dashboard/kpis");
        setData(res.data);
      } catch (error) {
        console.error("Error cargando KPIs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  if (loading) return <p>Cargando métricas...</p>;
  if (!data) return <p>No se pudieron cargar los datos.</p>;

  const cards = [
    { title: "Docentes", value: data.docentes, icon: "fa-solid fa-chalkboard-user", color: "primary" },
    { title: "Clases",   value: data.clases,   icon: "fa-solid fa-book-open",        color: "success" },
    { title: "Espacios", value: data.espacios, icon: "fa-solid fa-door-open",        color: "warning" },
    { title: "PNF",      value: data.pnf,      icon: "fa-solid fa-graduation-cap",   color: "danger" },
  ];

  const handleKey = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      // ejemplo: podrías navegar o abrir detalle
      console.log("Activada tarjeta", idx);
    }
  };

  return (
    <>
      <div className="row mt-3">
        {cards.map((card, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleKey(e, index)}
              className={`card text-white bg-${card.color} shadow-sm h-100 card-hover`}
              style={{ borderRadius: "10px" }}
            >
              <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-3">
                <i className={`${card.icon} fs-2 mb-2`}></i>
                <h6 className="card-title mb-1">{card.title}</h6>
                <h4 className="fw-bold mb-0">{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
