import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
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

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["name", "groupedPermissions"];

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
            <div className="p-3">
              <h4 className="fw-bold">PERMISOS:</h4>

              {row.groupedPermissions &&
              Object.keys(row.groupedPermissions).length > 0 ? (
                <PermisosPorModulo permisos={row.groupedPermissions} />
              ) : (
                <p className="text-muted">No hay permisos asignados</p>
              )}
            </div>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("rol.editar") || permisos.includes("rol.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/rol/${row.id}/edit`}
                urlDelete={`/rol/${row.id}`}
                navegar="/roles"
                editar="rol.editar"
                eliminar="rol.eliminar"
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
          permisos.includes("rol.crear") ? <Create path="/rol/create" /> : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={roles} searchFields={camposBusqueda} />}
        // Manejar el estado de carga
        isLoading={loading}
      />
    </>
  );
}

const PermisosPorModulo = ({ permisos }) => {
  return (
    <div className="permisos-modulos">
      {Object.entries(permisos).map(([modulo, permisosLista]) => (
        <div key={modulo} className="modulo mb-3 p-3 border rounded">
          <h5 className="fw-bold text-capitalize">{modulo}</h5>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {permisosLista.map((permiso) => (
              <span key={permiso.id} className="badge bg-primary">
                {permiso.action}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roles;
