import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Api, { GetAll } from "../../services/Api";
import Alerta, {
  AlertaConfirm,
  AlertaError,
  AlertaLoading,
  AlertaSuccess,
} from "../../components/Alert";
import Acciones from "../../components/Acciones";
import { ButtomModal, Modal } from "../../components/Modal";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { Buttom } from "../../components/Buttom";

export function LapsoAcademico() {
  const [loading, setLoading] = useState(true);
  const [lapsos, setLapsos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();
  const { refreshLapsos } = useAuth();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    cargarLapsos();


    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Función para cargar los lapsos
  const cargarLapsos = () => {
    GetAll(setLapsos, setLoading, "/lapsos");
  };

  // Función para cambiar el estado de un lapso
  const toggleEstadoLapso = async (id, statusActual) => {
    try {
      // Mostrar confirmación
      const confirmacion = await AlertaConfirm(
        `¿Estás seguro de ${
          statusActual ? "desactivar" : "activar"
        } este lapso académico?`,
        "Confirmar cambio de estado",
        statusActual ? "Sí, desactivar" : "Sí, activar"
      );

      if (!confirmacion.isConfirmed) {
        return;
      }

      // Mostrar loading
      AlertaLoading("Cambiando estado...");

      const response = await Api.put(`/lapsos/${id}/estado`);

      // Cerrar loading
      Swal.close();

      if (response.data.success) {
        // Recargar todos los lapsos para reflejar el cambio global (solo uno activo)
        cargarLapsos(); 
        refreshLapsos();

        AlertaSuccess(
          `Lapso ${
            response.data.data.status ? "activado" : "desactivado"
          } correctamente`,
          "¡Operación exitosa!"
        );
      } else {
        AlertaError("Error al cambiar el estado", "Error");
        // Recargar para asegurar consistencia
        cargarLapsos();
      }
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      Swal.close();

      if (error.response?.data?.message) {
        AlertaError(error.response.data.message, "Error");
      } else {
        AlertaError("Error al cambiar el estado del lapso", "Error");
      }

      // Recargar para asegurar consistencia
      cargarLapsos();
    }
  };

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
      name: "FECHA INICIO",
      selector: (row) => new Date(row.fecha_inicio).toLocaleDateString("es-ES"),
      sortable: true,
    },
    {
      name: "FECHA FIN",
      selector: (row) => new Date(row.fecha_fin).toLocaleDateString("es-ES"),
      sortable: true,
    },
    {
      name: "ESTADO",
      cell: (row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id={`estado-lapso-${row.id}`}
            checked={row.status === true } // Esto debe ser un booleano
            onChange={() => toggleEstadoLapso(row.id, row.status)}
            //disabled={!permisos.includes("lapso.editar")}
          />
          <label
            className="form-check-label"
            htmlFor={`estado-lapso-${row.id}`}
          >
            {row.status == true ? "ACTIVO" : "INACTIVO"}
          </label>
        </div>
      ),
      width: "150px",
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.nombre_lapso}`} id={row.id}>
            <p>
              <b>AÑO: </b> {row.ano}
            </p>
            <p>
              <b>TIPO DE LAPSO: </b> {row.tipolapso?.nombre || "No disponible"}
            </p>
            <p>
              <b>FECHA DE INICIO: </b>{" "}
              {new Date(row.fecha_inicio).toLocaleDateString("es-ES")}
            </p>
            <p>
              <b>FECHA DE FINALIZACIÓN: </b>{" "}
              {new Date(row.fecha_fin).toLocaleDateString("es-ES")}
            </p>
            <p>
              <b>ESTADO: </b> {row.status == true ? "ACTIVO" : "INACTIVO"}
            </p>
          </Modal>
        </div>
      ),
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
        title="LAPSO ACADÉMICO"
        button_pdf={
          permisos.includes("lapso.pdf") ?
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
