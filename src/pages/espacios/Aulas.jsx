import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useEffect, useState } from "react";
import Api, { GetAll } from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import Acciones from "../../components/Acciones";
import { Modal, ButtomModal } from "../../components/Modal";
import { Buttom } from "../../components/Buttom";

export default function Aulas() {
  const [loading, setLoading] = useState(true);
  const [aulas, setAulas] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setAulas, setLoading, "/aula");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

    const descargarPDF = async () => {
      try {
        const response = await Api.get("/aula/pdf", {
          responseType: "blob",
          withCredentials: true,
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "aula.pdf");
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
    { name: "ID", selector: (row, index) => index + 1, sortable: true },
    { name: "CÓDIGO", selector: (row) => row.codigo, sortable: true },
    { name: "NOMBRE", selector: (row) => row.nombre_aula, sortable: true },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.nombre_aula}`} id={row.id}>
            <p>
              <b>CÓDIGO: </b> {row.codigo}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre_aula}
            </p>
            <p>
              <b>ETAPA: </b> {row.etapa}
            </p>
            <p>
              <b>NÚMERO: </b> {row.nro_aula}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("aula.editar") || permisos.includes("aula.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/aula/${row.id}/edit`}
                urlDelete={`/aula/${row.id}`}
                navegar="/aula"
                editar="aula.editar"
                eliminar="aula.eliminar"
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
        title="AULAS"
        // Boton para generar PDF

        button_pdf={
          permisos.includes("aula.pdf") ?
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
          permisos.includes("aula.crear") ? (
            <Create path="/aula/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={aulas} />}
        // Loader
        isLoading={loading}
      />
    </>
  );
}
