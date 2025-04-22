import React from "react";
import { Create } from "../../components/Link";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
export default function Laboratorios() {
  return (    
  <>
        {/* Contenedor para la tablas */}
        <ContainerTable
          // Titulo para la tabla
          title="LABORATORIO"
          // Boton para crear nuevos registros
          link={<Create path="/laboratorio/create" />}
          // Tabla
          tabla={<Tabla />}
        />
      </>
  );
}
