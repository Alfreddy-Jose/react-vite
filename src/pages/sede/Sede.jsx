import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Alerta, { AlertaError } from "../../components/Alert";
import Api, { GetAll } from "../../services/Api";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";
import { Buttom } from "../../components/Buttom";
import { useLocation } from "react-router-dom";

export function Sede() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
    const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = [
    "nro_sede",
    "nombre_sede",
    "nombre_abreviado",
    "municipio.municipio",
  ];

  useEffect(() => {
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);
    GetAll(setSedes, setLoading, "/sedes");

    if (location.state?.message) {
      Alerta(location.state.message);
    }

    window.history.replaceState({}, "");
  }, [location.state]);

  const descargarPDF = async () => {
    try {
      const response = await Api.get("/sedes/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sedes.pdf");
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
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "NÚMERO SEDE",
      selector: (row) => row.nro_sede,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre_sede,
      sortable: true,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />
          <Modal titleModal={`+INFO ${row.nombre_abreviado}`} id={row.id}>
            <p>
              <b>NÚMERO SEDE: </b> {row.nro_sede}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre_sede}
            </p>
            <p>
              <b>ABREVIADO: </b> {row.nombre_abreviado}
            </p>
            <p>
              <b>DIRECCIÓN: </b> {row.direccion}
            </p>
            <p>
              {/* Mostrar municipio en mayúsculas */}
              <b>MUNICIPIO: </b> {row.municipio.municipio.toUpperCase()}
            </p>
          </Modal>
        </div>
      ),
    },
    ...(permisos.includes("sede.editar") || permisos.includes("sede.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/sede/${row.id}/edit`}
                urlDelete={`/sede/${row.id}`}
                navegar="/sede"
                editar="sede.editar"
                eliminar="sede.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <ContainerTable
        title="SEDES"
        // Boton para generar PDF
        button_pdf={
          permisos.includes("sede.pdf") ? (
            <Buttom
              type="button"
              style="btn btn-danger mb-3"
              onClick={descargarPDF}
              title="Generar PDF"
              text="Generar PDF"
            />
          ) : null
        }
        link={
          permisos.includes("sede.crear") ? (
            <Create path="/sede/create" />
          ) : null
        }
        isLoading={loading}
        tabla={
          <Tabla data={sedes} columns={columns} searchFields={camposBusqueda} />
        }
      />
    </>
  );
}
