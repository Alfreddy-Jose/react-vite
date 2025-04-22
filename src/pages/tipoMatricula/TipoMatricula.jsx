import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import DataTableComponent from "../../components/TablaPrue";

export function TipoMatricula() {
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="TIPO MATRICULA"
        // Boton para crear nuevos registros
        link={<Create path="/tipo_matricula/create" />}
        // Tabla
        tabla={<DataTableComponent />}
      />
    </>
  );
}
