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
import Layout from "../components/Layout";
import Persona from "../pages/persona/Persona";
import PersonaCreate from "../pages/persona/PersonaCreate";
import PersonaEdit from "../pages/persona/PersonaEdit";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Ruta del Dashboard */}
        <Route
          path="/"
          element={
            <Layout>
              <Panel />
            </Layout>
          }
        />

        {/* Rutas de Usuario */}
        <Route
          path="/usuarios"
          element={
            <Layout>
              <Usuario />
            </Layout>
          }
        />
        <Route
          path="/usuarios/create"
          element={
            <Layout>
              <UsuarioCreate />
            </Layout>
          }
        />

        {/* Rutas de PNF */}
        <Route
          path="/pnf"
          element={
            <Layout>
              <Pnf />
            </Layout>
          }
        />
        <Route
          path="/pnf/create"
          element={
            <Layout>
              <PnfCreate />
            </Layout>
          }
        />
        <Route
          path="/pnf/:id/edit"
          element={
            <Layout>
              <PnfEdit />
            </Layout>
          }
        />

        {/* Rutas de Sede */}
        <Route
          path="/sede"
          element={
            <Layout>
              <Sede />
            </Layout>
          }
        />
        <Route
          path="/sede/create"
          element={
            <Layout>
              <SedeCreate />
            </Layout>
          }
        />
        <Route
          path="/sede/:id/edit"
          element={
            <Layout>
              <SedeEdit />
            </Layout>
          }
        />

        {/* Rutas de Lapso Academico */}
        <Route
          path="/lapso_academico"
          element={
            <Layout>
              <LapsoAcademico />
            </Layout>
          }
        />
        <Route
          path="/lapso_academico/create"
          element={
            <Layout>
              <LapsoAcademicoCreate />
            </Layout>
          }
        />
        <Route
          path="/lapso_academico/:id/edit"
          element={
            <Layout>
              <LapsoAcademicoEdit />
            </Layout>
          }
        />

        {/* Rutas de Tipo de matricula */}
        <Route
          path="/tipo_matricula"
          element={
            <Layout>
              <TipoMatricula />
            </Layout>
          }
        />
        <Route
          path="/tipo_matricula/create"
          element={
            <Layout>
              <TipoMatriculaCreate />
            </Layout>
          }
        />
        <Route
          path="/tipo_matricula/:id/edit"
          element={
            <Layout>
              <TipoMatriculaEdit />
            </Layout>
          }
        />

        {/* Rutas de Secciones*/}
        <Route
          path="/secciones"
          element={
            <Layout>
              <Secciones />
            </Layout>
          }
        />
        {/* <Route path="/secciones/create" element={<SeccionesCreate />} /> */}

        {/* Rutas de Bloques de horas*/}
        <Route
          path="/bloques"
          element={
            <Layout>
              <Bloques />
            </Layout>
          }
        />
        <Route
          path="/bloques/create"
          element={
            <Layout>
              <BloquesCreate />
            </Layout>
          }
        />

        {/* Rutas para los espacios*/}
        <Route
          path="/aula"
          element={
            <Layout>
              <Aulas />
            </Layout>
          }
        />
        <Route
          path="/aula/create"
          element={
            <Layout>
              <AulasCreate />
            </Layout>
          }
        />
        <Route
          path="/laboratorio"
          element={
            <Layout>
              <Laboratorios />
            </Layout>
          }
        />
        <Route
          path="/laboratorio/create"
          element={
            <Layout>
              <LaboratoriosCreate />
            </Layout>
          }
        />

        {/* Rutas para los Roles */}
        <Route
          path="/roles"
          element={
            <Layout>
              <Roles />
            </Layout>
          }
        />

        {/* Rutas para la Universidad */}
        <Route
          path="/universidad"
          element={
            <Layout>
              <Universidad />
            </Layout>
          }
        />

        {/* Rutas para Personas */}
        <Route
          path="/persona"
          element={
            <Layout>
              <Persona />
            </Layout>
          }
        />
        <Route
          path="/persona/create"
          element={
            <Layout>
              <PersonaCreate />
            </Layout>
          }
        />
        <Route
          path="/persona/:id/edit"
          element={
            <Layout>
              <PersonaEdit />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}
