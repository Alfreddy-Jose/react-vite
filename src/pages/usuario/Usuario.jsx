import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api from "../../services/Api";
import Acciones from "../../components/Acciones";
import { Tabla } from "../../components/Tabla";

const columns = [
  { name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  { name: "NOMBRE",
    selector: (row) => row.name,
    sortable: true,
  },
  { name: "EMAIL",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "ROL",
    selector: row => row.roles.join(', '),
    sortable: true,
  },
  {
    name: "ACCIONES",
    cell: (row) =>(
      <Acciones url={`/usuario/${row.id}/edit`} />
    )
  }
]

export function Usuario() {

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getAllUsuarios();
  }, []);

  const getAllUsuarios = async () => {
    const response = await Api.get(`/usuarios`);
    setUsuarios(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="USUARIOS"
        // Boton para crear nuevos registros
        link={<Create path="/usuarios/create" />}
        // Tabla
        tabla={<Tabla
            columns={columns}
            data={usuarios}
          />}
      />
    </>
  );
}
