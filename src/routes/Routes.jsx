import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Panel } from "../pages/Panel";
import { Usuario } from "../pages/usuario/Usuario";
import { Pnf } from "../pages/pnf/Pnf";
import { LapsoAcademico } from "../pages/lapsoAcademico/LapsoAcademico";
import { Sede } from "../pages/sede/Sede";
import { TipoMatricula } from "../pages/tipoMatricula/TipoMatricula";
import { UsuarioCreate } from "../pages/usuario/UsuarioCreate";
import { PnfCreate } from "../pages/pnf/PnfCreate";
import { SedeCreate } from "../pages/sede/SedeCreate";
import { LapsoAcademicoCreate } from "../pages/lapsoAcademico/LapsoAcademicoCreate";
import { TipoMatriculaCreate } from "../pages/tipoMatricula/TipoMatriculaCreate";
import { Secciones } from "../pages/secciones/Secciones";
import { Bloques } from "../pages/bloques/Bloques";
import { BloquesCreate } from "../pages/bloques/BloquesCreate";
import Aulas from "../pages/espacios/Aulas";
import AulasCreate from "../pages/espacios/AulasCreate";
import Laboratorios from "../pages/espacios/Laboratorios";
import LaboratoriosCreate from "../pages/espacios/LaboratorioCreate";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="/panel" element={<Panel />} />

        {/* Rutas de Usuario */}
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/usuarios/create" element={<UsuarioCreate />} />

        {/* Rutas de PNF */}
        <Route path="/pnf" element={<Pnf />} />
        <Route path="/pnf/create" element={<PnfCreate />} />

        {/* Rutas de Sede */}
        <Route path="/sede" element={<Sede />} />
        <Route path="/sede/create" element={<SedeCreate />} />

        {/* Rutas de Lapso Academico */}
        <Route path="/lapso_academico" element={<LapsoAcademico />} />
        <Route
          path="/lapso_academico/create"
          element={<LapsoAcademicoCreate />}
        />

        {/* Rutas de Tipo de matricula */}
        <Route path="/tipo_matricula" element={<TipoMatricula />} />
        <Route
          path="/tipo_matricula/create"
          element={<TipoMatriculaCreate />}
        />
        {/* Rutas de Secciones*/}
        <Route path="/secciones" element={<Secciones />} />
        {/* <Route path="/secciones/create" element={<SeccionesCreate />} /> */}

        {/* Rutas de Bloques de horas*/}
        <Route path="/bloques" element={<Bloques />} />
        <Route path="/bloques/create" element={<BloquesCreate />} />

        {/* Rutas para los espacios*/}
        <Route path="/aula" element={<Aulas />} />
        <Route path="/aula/create" element={<AulasCreate />} />
        <Route path="/laboratorio" element={<Laboratorios />} />
        <Route path="/laboratorio/create" element={<LaboratoriosCreate />} />
      </Routes>
    </>
  );
}
