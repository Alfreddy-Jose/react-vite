import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { useLocation } from "react-router-dom";
import Api, { GetAll } from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { Buttom } from "../../components/Buttom";

export function TipoMatricula() {
  const [loading, setLoading] = useState(true);
  const [matricula, setMatricula] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["numero", "nombre"];

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de Matricula
    GetAll(setMatricula, setLoading, "/matriculas");

    // Motrar Alerta al registrar unm nuevo tipo de matricula
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const descargarPDF = async () => {
    try {
      const response = await Api.get("/matricula/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tipoMatricula.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      AlertaError("Error al descargar el PDF");
      console.error(error);
    }
  };

  // Definir las columnas de la tabla
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
      sortable: true,
    },
    {
      name: "NÚMERO",
      selector: (row) => row.numero,
      sortable: true,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("Tipo Matricula.editar") ||
    permisos.includes("Tipo Matricula.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/tipo_matricula/${row.id}/edit`}
                urlDelete={`/matricula/${row.id}`}
                navegar="/matricula"
                editar="Tipo Matricula.editar"
                eliminar="Tipo Matricula.eliminar"
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
        title="TIPO MATRÍCULA"
        // Boton para descargar PDF
        button_pdf={
          permisos.includes("Tipo Matricula.pdf") ?
          (<Buttom
            type="button"
            style="btn btn-danger mb-3"
            onClick={descargarPDF}
            title="Generar PDF"
            text="Generar PDF"
          />) : null
        }
        // Boton para crear nuevos registros
        link={
          permisos.includes("Tipo Matricula.crear") ? (
            <Create path="/tipo_matricula/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla data={matricula} columns={columns} searchFields={camposBusqueda} /> }
        isLoading={loading}
      />
    </>
  );
}
