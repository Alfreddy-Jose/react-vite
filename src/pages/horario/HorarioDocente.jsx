import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Buttom } from "../../components/Buttom";
import Api from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";

export function HorariosDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docentesFiltrados, setDocentesFiltrados] = useState([]);

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["persona.nombre", "persona.apellido"];
  // Inicializar datos filtrados
  useEffect(() => {
    setDocentesFiltrados(docentes);
  }, [docentes]);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const response = await Api.get("/docentes/con_clases");
        setDocentes(response.data);
      } catch (error) {
        AlertaError("Error al cargar los docentes con clases");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarDocentes();
  }, []);

  const descargarHorario = async (docenteId) => {
    try {
      const response = await Api.get(`/docentes/${docenteId}/horario/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `horario_docente_${docenteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      AlertaError("Error al descargar el horario del docente");
      console.error(error);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
    },
    {
      name: "DOCENTE",
      selector: (row) =>
        `${row.persona?.nombre || ""} ${row.persona?.apellido || ""}`,
      sortable: true,
      grow: 3,
    },
    {
      name: "CLASES ASIGNADAS",
      selector: (row) => row.clases_count,
    },
    {
      name: "ACCIONES",
      cell: (row) => (
        <Buttom
          type="button"
          style="btn btn-primary"
          onClick={() => descargarHorario(row.id)}
          title="Descargar"
          text="Descargar PDF"
        />
      ),
    },
  ];

  return (
    <ContainerTable
      title="HORARIOS POR DOCENTES"
      // propiedades para el buscador
      data={docentes}
      searchData={docentes}
      onSearchFiltered={setDocentesFiltrados}
      searchFields={camposBusqueda}
      placeholder="BUSCAR..."
      showStats={true}
      isLoading={loading}
      tabla={<Tabla columns={columns} data={docentesFiltrados} />}
    />
  );
}
