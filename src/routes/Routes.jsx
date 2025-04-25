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
import PnfEdit from "../pages/pnf/PnfEdit";
import Roles from "../pages/roles/Roles";
import { TipoMatriculaEdit } from "../pages/tipoMatricula/MatriculaEdit";
import { Universidad } from "../pages/universidad/Universidad";
import { SedeEdit } from "../pages/sede/SedeEdit";
import { LapsoAcademicoEdit } from "../pages/lapsoAcademico/LapsoAcademicoEdit";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route index path="/panel" element={<Panel />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas de Usuario */}
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/usuarios/create" element={<UsuarioCreate />} />

        {/* Rutas de PNF */}
        <Route path="/pnf" element={<Pnf />} />
        <Route path="/pnf/create" element={<PnfCreate />} />
        <Route path="/pnf/:id/edit" element={<PnfEdit />} />

        {/* Rutas de Sede */}
        <Route path="/sede" element={<Sede />} />
        <Route path="/sede/create" element={<SedeCreate />} />
        <Route path="/sede/:id/edit" element={<SedeEdit />} />

        {/* Rutas de Lapso Academico */}
        <Route path="/lapso_academico" element={<LapsoAcademico />} />
        <Route
          path="/lapso_academico/create"
          element={<LapsoAcademicoCreate />}
        />
        <Route path="/lapso_academico/:id/edit" element={<LapsoAcademicoEdit />} />

        {/* Rutas de Tipo de matricula */}
        <Route path="/tipo_matricula" element={<TipoMatricula />} />
        <Route
          path="/tipo_matricula/create"
          element={<TipoMatriculaCreate />}
        />
        <Route path="/tipo_matricula/:id/edit" element={<TipoMatriculaEdit />} />

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

        {/* Rutas para los Roles */}
        <Route path="/roles" element={<Roles />} />

        {/* Rutas para la Universidad */}
        <Route path="/universidad" element={<Universidad />} />

      </Routes>
    </>
  );
}
