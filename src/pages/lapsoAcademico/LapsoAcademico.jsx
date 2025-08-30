import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Api, { GetAll } from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import Acciones from "../../components/Acciones";

export function LapsoAcademico() {
  const [loading, setLoading] = useState(true);
  const [lapsos, setLapsos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de PNF
    GetAll(setLapsos, setLoading, "/lapsos");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const descargarPDF = async () => {
    try {
      const response = await Api.get("/lapsos/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "LapsoAcademico.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      AlertaError("Error al descargar el PDF");
      console.error(error);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
      sortable: true,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre_lapso,
    },
    {
      name: "AÑO",
      selector: (row) => row.ano,
      sortable: true,
    },
    {
      name: "TIPO DE LAPSO",
      selector: (row) => row.tipolapso.nombre,
      sortable: true,
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("lapso.editar") || permisos.includes("lapso.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/lapso_academico/${row.id}/edit`}
                urlDelete={`/lapso/${row.id}`}
                navegar="/lapso_academico"
                editar="lapso.editar"
                eliminar="lapso.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="LAPSO ACADEMICO"
        button_pdf={
          <button
            type="button"
            className="btn btn-danger mb-3"
            onClick={descargarPDF}
          >
            Generar PDF
          </button>
        }
        // Boton para crear nuevos registros
        link={
          permisos.includes("lapso.crear") ? (
            <Create path="/lapso_academico/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={lapsos} />}
        isLoading={loading}
      />
    </>
  );
}
