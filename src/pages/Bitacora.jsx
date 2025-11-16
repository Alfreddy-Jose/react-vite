import { useEffect, useState } from "react";
import { ContainerTable } from "../components/ContainerTable";
import { Tabla } from "../components/Tabla";
import Api, { GetAll } from "../services/Api";
import Modal, { ButtomModal } from "../components/Modal";
import { formatFecha, formatHora } from "../funciones";

export function Bitacora() {
  const [bitacora, setBitacora] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campos por los que buscar
  const camposBusqueda = [
    "accion",
    "tabla",
    "user.name", // si el usuario tiene name
    "registro_id",
  ];

  useEffect(() => {
    GetAll(setBitacora, setLoading, "/bitacora");
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "80px",
    },
    {
      name: "USUARIO",
      selector: (row) => row.user?.name ?? "Sin usuario",
      sortable: true,
    },
    {
      name: "ACCIÓN",
      selector: (row) => row.accion,
      sortable: true,
    },
    {
      name: "TABLA",
      selector: (row) => row.tabla.toUpperCase(),
      sortable: true,
    },
    {
      name: "REGISTRO",
      selector: (row) => row.registro_id,
    },
  {
    name: "FECHA",
    selector: (row) => formatFecha(row.created_at),
    sortable: true,
  },
  {
    name: "HORA",
    selector: (row) => formatHora(row.created_at),
    sortable: true,
  },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />
          <Modal titleModal={`Detalle Bitácora #${row.id}`} id={row.id}>
            <p>
              <b>USUARIO:</b> {row.user?.name ?? "Sin usuario"}
            </p>
            <p>
              <b>ACCIÓN:</b> {row.accion}
            </p>
            <p>
              <b>TABLA:</b> {row.tabla.toUpperCase()}
            </p>
            <p>
              <b>REGISTRO ID:</b> {row.registro_id}
            </p>
            <p>
              <b>FECHA:</b> {formatFecha(row.created_at)}
            </p>
            <p>
              <b>HORA:</b> {formatHora(row.created_at)}
            </p>

            <hr />

            <p>
              <b>DATOS ANTERIORES:</b>
            </p>
            <pre style={{ background: "#f5f5f5", padding: "10px" }}>
              {row.datos_anteriores
                ? JSON.stringify(JSON.parse(row.datos_anteriores), null, 2)
                : "Sin datos"}
            </pre>

            <p>
              <b>DATOS NUEVOS:</b>
            </p>
            <pre style={{ background: "#f5f5f5", padding: "10px" }}>
              {row.datos_nuevos
                ? JSON.stringify(JSON.parse(row.datos_nuevos), null, 2)
                : "Sin datos"}
            </pre>
          </Modal>
        </div>
      ),
    },
  ];

  return (
    <>
      <ContainerTable
        title="BITÁCORA DEL SISTEMA"
        isLoading={loading}
        tabla={
          <Tabla
            data={bitacora}
            columns={columns}
            searchFields={camposBusqueda}
          />
        }
      />
    </>
  );
}
