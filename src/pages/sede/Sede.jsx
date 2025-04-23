import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import Api from "../../services/Api";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
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
    name: "ABREVIADO",
    selector: (row) => row.nombre_abreviado,
    sortable: true,
  },
  {
    name: "DIRECCIÓN",
    selector: (row) => row.direccion,
    sortable: true,
  },
  {
    name: "MUNICIPIO",
    selector: (row) => row.municipio,
    sortable: true,
  },
];

const paginacionObciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Sede() {

  const [sedes, setSedes] = useState([]);
  const location = useLocation();

  useEffect(() => {

    // Mostrar la lista de PNF
    getAllSedes();

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");

  }, [location.state]);

  const getAllSedes = async () => {
    const response = await Api.get(`/sedes`);
    setSedes(response.data);
  };



    return (
      <>
        <ContainerTable 
          link={<Create path="/sede/create" />}
          title="SEDES"
          tabla={<DataTable
            className="table-responsive"
            columns={columns}
            data={sedes}
            pagination
            paginationComponentOptions={paginacionObciones}
            fixedHeader
            />}
        />
      </>
    );
  }