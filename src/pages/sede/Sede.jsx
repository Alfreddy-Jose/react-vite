import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";

export function Sede() {
    return (
      <>
        <ContainerTable 
          link={<Create path="/sede/create" />}
          title="SEDES"
          tabla={<Tabla />}
        />
      </>
    );
  }