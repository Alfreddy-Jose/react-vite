//import { useEffect, useState } from "react";
//import Api from "../services/Api";
//import { Alerta } from "./Alert";
import DataTable from "react-data-table-component";

const Romulo = [
  { id: 1, name: "Romulo", email: "romulobvv@gmail.com", rol: "Asistente" },
  {
    id: 2,
    name: "Alfreddy",
    email: "alfreddy@gmail.com",
    rol: "Administrador",
  },
];

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.name,
  },
  {
    name: "CORREO",
    selector: (row) => row.email,
  },
  {
    name: "ROL",
    selector: (row) => row.rol,
  },
];

const paginacionObciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Tabla() {
  /*   const [pnf, setPnf] = useState([]);

  useEffect(() => {
    getAllPnf();
    Alerta();
  }, []);

  const getAllPnf = async () => {
    const response = await Api.get(`/pnf`);
    setPnf(response.data);
  }; */

  return (
    <div>
      <DataTable
        className="table-responsive"
        columns={columns}
        data={Romulo}
        pagination
        paginationComponentOptions={paginacionObciones}
        fixedHeader
        fixedHeaderScrollHeight="600px"
      />
    </div>
  );
}
