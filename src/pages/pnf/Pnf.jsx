import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api from "../../services/Api";
import DataTable from "react-data-table-component";


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
  },
  {
    name: "ABREVIADO",
    selector: (row) => row.abreviado,
    sortable: true,
  },
  {
    name: "ABREVIADO COORDINACIÓN",
    selector: (row) => row.abreviado_coord,
    sortable: true,
  }
];

const paginacionObciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Pnf() {
  const [pnf, setPnf] = useState([]);

  useEffect(() => {
    getAllPnf();
  }, []);

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
            fixedHeaderScrollHeight="500px"
          />
        }
      />
    </>
  );
}
