import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";

export function Secciones() {
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="SECCIONES"
        // Boton para crear nuevos registros
        link={<Create path="/seccion/create" />}
        // Tabla
        tabla={<Tabla />}
      />
    </>
  );
}
