import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";

export default function Aulas() {
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="AULAS"
        // Boton para crear nuevos registros
        link={<Create path="/aula/create" />}
        // Tabla
        tabla={<Tabla />}
      />
    </>
  );
}
