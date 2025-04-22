import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";

export function LapsoAcademico() {
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="LAPSO ACADEMICO"
        // Boton para crear nuevos registros
        link={<Create path="/lapso_academico/create" />}
        // Tabla
        tabla={<Tabla />}
      />
    </>
  );
}
