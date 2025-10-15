import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { GetAll } from "../../services/Api";
import Api from "../../services/Api";
import Acciones from "../../components/Acciones";
import { Tabla } from "../../components/Tabla";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";

// Utilidad para obtener la baseURL del backend (sin /api al final)
const getBackendBaseUrl = () => {
  let url = Api.defaults.baseURL || "";
  // Elimina /api si está al final
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  // Elimina barra final si existe
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

export function Usuario() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["name", "email", "roles[0].name"];

  useEffect(() => {
    // Leer permisos cada vez que el componente se monta o el localStorage cambia
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setUsuarios, setLoading, "/usuarios");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }
    
    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Función para obtener la URL completa del avatar
  const getAvatarUrl = (user) => {
    if (user.avatar) {
      // Si el avatar ya es una URL completa
      if (user.avatar.startsWith("http")) {
        return user.avatar;
      }
      // Si es una ruta relativa, construir la URL completa usando la baseURL del backend
      return `${getBackendBaseUrl()}/storage/${user.avatar}`;
    }
    // Avatar por defecto si no tiene
    return "/default-avatar.png"; // Asegúrate de tener esta imagen en tu public folder
  };
  

  const columns = [
    { name: "ID", selector: (row, index) => index + 1, sortable: true },
    { name: "NOMBRE", selector: (row) => row.name, sortable: true },
    { name: "EMAIL", selector: (row) => row.email, sortable: true },
    { 
      name: "AVATAR", 
      selector: (row) => row.avatar,
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <img 
            src={getAvatarUrl(row)}
            alt={`Avatar de ${row.name}`}
            className="rounded-circle"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              border: "2px solid #dee2e6"
            }}
            onError={(e) => {
              // Si la imagen falla al cargar, mostrar una por defecto
              e.target.src = "/default-avatar.png";
            }}
          />
        </div>
      ),
      width: "80px",
      center: true
    },
    {
      name: "ROL",
      selector: (row) =>
        row.roles && row.roles.length > 0 ? row.roles[0].name : "Sin rol",
      sortable: true,
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("usuario.editar") ||
    permisos.includes("usuario.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/usuario/${row.id}/edit`}
                urlDelete={`/usuario/${row.id}`}
                navegar="/Usuarios"
                editar="usuario.editar"
                eliminar="usuario.eliminar"
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
        title="USUARIOS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("usuario.crear") ? (
            <Create path="/usuarios/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={usuarios} searchFields={camposBusqueda} />}
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}
