import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api from "../../services/Api";
import DataTable from "react-data-table-component";
import { Link, useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import Modal from "../../components/Modal";
import { Buttom } from "../../components/Buttom";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "CODIGO",
    selector: (row) => row.codigo,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.nombre,
    sortable: true,
    grow: 3
  },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <button
          type="button"
          className="btn btn-info"
          data-bs-toggle="modal"
          data-bs-target={`#${row.id}`}
        >
          <i className="fas fa-lightbulb"></i>
        </button>

        <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id} >
          <p><b>CODIGO: </b> {row.codigo}</p>
          <p><b>NOMBRE: </b> {row.nombre}</p>
          <p><b>ABREVIADO: </b> {row.abreviado}</p>
          <p><b>ABREVIADO COORDINACIÓN: </b>{row.abreviado_coord}</p>
        </Modal>
      </div>
    ),
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div>
        <Link className="btn btn-primary" to={`/pnf/${row.id}/edit`}>
          <i className="far fa-edit"></i>
        </Link>
        <Buttom title="Eliminar" style="btn btn-danger" type="buttom" text={<i className="far fa-trash-alt"></i>} />
      </div>
    ),
  },
];

const paginacionObciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Pnf() {
  const [pnf, setPnf] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de PNF
    getAllPnf();

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const getAllPnf = async () => {
    const response = await Api.get(`/pnf`);
    setPnf(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas de PNF */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="PNF"
        // Boton para crear nuevos registros
        link={<Create path="/pnf/create" />}
        // Tabla
        tabla={
          <DataTable
            className="table-responsive"
            columns={columns}
            data={pnf}
            pagination
            paginationComponentOptions={paginacionObciones}
            fixedHeader
            //fixedHeaderScrollHeight="500px"
          />
        }
      />
    </>
  );
}
