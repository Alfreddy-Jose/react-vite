import React, { useEffect, useState } from "react";
import Api, { GetAll } from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos cada vez que el componente se monta o el localStorage cambia
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de registros
    GetAll(setRoles, setLoading, "/roles");

    // Motrar Alerta al registrar un nuevo registro
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
      sortable: true,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.name,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.name}`} id={row.id}>
            {/* mostrando permisos */}
            <p>
              <b>PERMISOS: </b>
              {row.permissions.length > 0
                ? row.permissions.map((permiso) => (
                    <span key={permiso.id} className="badge bg-secondary me-1">
                      {permiso.name}
                    </span>
                  ))
                : "No hay permisos asignados"}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar rol") || permisos.includes("eliminar rol")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/rol/${row.id}/edit`}
                urlDelete={`/rol/${row.id}`}
                navegar="/roles"
                editar="editar rol"
                eliminar="eliminar rol"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas de los datos */}
      <ContainerTable
        // Titulo para la tabla
        title="ROLES"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear rol") ? <Create path="/rol/create" /> : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={roles} />}
        // Manejar el estado de carga
        isLoading={loading}
      />
    </>
  );
}

export default Roles;
