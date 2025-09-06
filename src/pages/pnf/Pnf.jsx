import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api, { GetAll } from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import { Modal, ButtomModal } from "../../components/Modal";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { Buttom } from "../../components/Buttom";

export function Pnf() {
  const [pnf, setPnf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de PNF
    GetAll(setPnf, setLoading, "/pnf");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const descargarPDF = async () => {
    try {
      const response = await Api.get("/pnf/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pnfs.pdf");
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
      sortable: false,
    },
    {
      name: "CODIGO",
      selector: (row) => row.codigo,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
      grow: 3,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id}>
            <p>
              <b>CODIGO: </b> {row.codigo}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre}
            </p>
            <p>
              <b>ABREVIADO: </b> {row.abreviado}
            </p>
            <p>
              <b>ABREVIADO COORDINACIÓN: </b>
              {row.abreviado_coord}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("pnf.editar") || permisos.includes("pnf.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/pnf/${row.id}/edit`}
                urlDelete={`/pnf/${row.id}`}
                navegar="/pnf"
                editar="pnf.editar"
                eliminar="pnf.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas de PNF */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="PNF"
        button_pdf={
          permisos.includes("pnf.pdf") ? (
          <Buttom
            type="button"
            style="btn btn-danger mb-3"
            onClick={descargarPDF}
            title="Generar PDF"
            text="Generar PDF"
          />) : null
        }
        // Boton para crear nuevos registros
        link={
          permisos.includes("pnf.crear") ? <Create path="/pnf/create" /> : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={pnf} />}
      />
    </>
  );
}
