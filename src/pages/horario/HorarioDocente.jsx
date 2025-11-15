import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Buttom } from "../../components/Buttom";
import Api from "../../services/Api";
import { AlertaError } from "../../components/Alert";

export function HorariosDocentes() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["persona.nombre", "persona.apellido"];

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

  const descargarHorario = async (docenteId, trimestreId, nombre_completo, nombre_trimestre) => {
    
    // Funcion para reemplazar espacios por "_" en nombre_completo
    nombre_completo = nombre_completo.replace(/\s/g, "_");

    try {
      const url_descargar = trimestreId 
        ? `/generar_pdf_docente/${docenteId}/${trimestreId}`
        : `/generar_pdf_docente/${docenteId}`;
      const response = await Api.get(url_descargar, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${nombre_completo}_trimestre_${nombre_trimestre}.pdf`);
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
      selector: (row) => row.nombre_completo,
      sortable: true,
    },
    {
      name: "TRIMESTRE",
      selector: (row) => row.trimestre_nombre,
    },
    {
      name: "CLASES",
      selector: (row) => row.clases_count,
    },
    {
      name: "ACCIONES",
      cell: (row) => (
        <Buttom
          type="button"
          style="btn btn-primary"
          onClick={() => descargarHorario(row.docente_id, row.trimestre_id, row.nombre_completo, row.trimestre_nombre)}
          title="Descargar"
          text="Descargar PDF"
        />
      ),
    },
  ];

  return (
    <ContainerTable
      title="HORARIOS POR DOCENTES"
      isLoading={loading}
      tabla={<Tabla columns={columns} data={docentes} searchFields={camposBusqueda} />}
    />
  );
}
