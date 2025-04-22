import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";

export function Bloques() {
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="BLOQUES DE HORAS"
        // Boton para crear nuevos registros
        link={<Create path="/bloques/create" />}
        // Tabla
        tabla={<Tabla />}
      />
    </>
  );
}
