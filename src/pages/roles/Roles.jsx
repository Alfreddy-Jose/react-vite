import React, { useEffect, useState } from "react";
import Api from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";


const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.name,
  },
  {
    name: "ACCIONES",
    cell: (row) => (
        <Acciones url={`/rol/${row.id}/edit`}/>
    ),
  },
];


function Roles() {
  const [roles, setRoles] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de registros
    getAllRoles();

    // Motrar Alerta al registrar un nuevo registro
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const getAllRoles = async () => {
    const response = await Api.get(`/roles`);
    setRoles(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas de los datos */}
      <ContainerTable
        // Titulo para la tabla 
        title="ROLES"
        // Boton para crear nuevos registros
        link={<Create path="/rol/create" />}
        // Tabla
        tabla={ <Tabla columns={columns} data={roles} /> }
      />
    </>
  )
}

export default Roles;
