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
import Coordinador from "../pages/Coordinador/Coordinador";
import ProtectedRoute from "../components/ProtectedRoute";
import NotPage from "../pages/Page404";
import UsuarioEdit from "../pages/usuario/UsuarioEdit";
import Horario from "../pages/horario/Horario";
import Turno from "../pages/turnos/Turno";
import Trayecto from "../pages/trayectos/Trayecto";
import TurnoCreate from "../pages/turnos/TurnoCreate";
import UnidadCurricular from "../pages/unidad_curricular/UnidadCurricular";
import UnidadCurricularCreate from "../pages/unidad_curricular/UnidadCurricularCreate";
import Docente from "../pages/docente/Docente";
import DocenteCreate from "../pages/docente/DocenteCreate";
import TrayectoCreate from "../pages/trayectos/TrayectoCreate";
import RolesCreate from "../pages/roles/RolesCreate";
import RolesEdit from "../pages/roles/RolesEdit";
import { SeccionesCreate } from "../pages/secciones/SeccionesCreate";
import UnidadCurricularEdit from "../pages/unidad_curricular/UnidadCurricularEdit";
import AulasEdit from "../pages/espacios/AulaEdit";
import LaboratorioEdit from "../pages/espacios/LaboratorioEdit";
import HorarioFullCalendar from "../pages/horario/HorarioFullCalendar";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Ruta del Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Panel />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Usuario */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Layout>
                <Usuario />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/create"
          element={
            <ProtectedRoute>
              <Layout>
                <UsuarioCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <UsuarioEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de PNF */}
        <Route
          path="/pnf"
          element={
            <ProtectedRoute>
              <Layout>
                <Pnf />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pnf/create"
          element={
            <ProtectedRoute>
              <Layout>
                <PnfCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pnf/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <PnfEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Sede */}
        <Route
          path="/sede"
          element={
            <ProtectedRoute>
              <Layout>
                <Sede />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sede/create"
          element={
            <ProtectedRoute>
              <Layout>
                <SedeCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sede/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <SedeEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Lapso Academico */}
        <Route
          path="/lapsos"
          element={
            <ProtectedRoute>
              <Layout>
                <LapsoAcademico />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lapso_academico/create"
          element={
            <ProtectedRoute>
              <Layout>
                <LapsoAcademicoCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lapso_academico/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <LapsoAcademicoEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Trayectos */}
        <Route
          path="/trayectos"
          element={
            <ProtectedRoute>
              <Layout>
                <Trayecto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trayecto/create"
          element={
            <ProtectedRoute>
              <Layout>
                <TrayectoCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Unidad Curricular */}
        <Route
          path="/unidad_curricular"
          element={
            <ProtectedRoute>
              <Layout>
                <UnidadCurricular />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unidad_curricular/create"
          element={
            <ProtectedRoute>
              <Layout>
                <UnidadCurricularCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unidad_curricular/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <UnidadCurricularEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Tipo de matricula */}
        <Route
          path="/matricula"
          element={
            <ProtectedRoute>
              <Layout>
                <TipoMatricula />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo_matricula/create"
          element={
            <ProtectedRoute>
              <Layout>
                <TipoMatriculaCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo_matricula/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <TipoMatriculaEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Secciones*/}
        <Route
          path="/secciones"
          element={
            <ProtectedRoute>
              <Layout>
                <Secciones />
              </Layout>
            </ProtectedRoute>
          }
        />
          <Route
          path="/seccion/create"
          element={
            <ProtectedRoute>
              <Layout>
                <SeccionesCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* <Route path="/secciones/create" element={<SeccionesCreate />} /> */}

        {/* Rutas de Bloques de horas*/}
        {/*         <Route
          path="/bloques"
          element={
            <ProtectedRoute>
              <Layout>
                <Bloques />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bloques/create"
          element={
            <ProtectedRoute>
              <Layout>
                <BloquesCreate />
              </Layout>
            </ProtectedRoute>
          }
        /> */}

        {/* Rutas de Turnos  */}
        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <Layout>
                <Turno />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/turno/create"
          element={
            <ProtectedRoute>
              <Layout>
                <TurnoCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para los espacios*/}
        <Route
          path="/aula"
          element={
            <ProtectedRoute>
              <Layout>
                <Aulas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aula/create"
          element={
            <ProtectedRoute>
              <Layout>
                <AulasCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aula/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <AulasEdit />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio"
          element={
            <ProtectedRoute>
              <Layout>
                <Laboratorios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio/create"
          element={
            <ProtectedRoute>
              <Layout>
                <LaboratoriosCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <LaboratorioEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para los Roles */}
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <Layout>
                <Roles />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rol/create"
          element={
            <ProtectedRoute>
              <Layout>
                <RolesCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rol/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <RolesEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para la Universidad */}
        <Route
          path="/universidad"
          element={
            <ProtectedRoute>
              <Layout>
                <Universidad />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Personas */}
        <Route
          path="/persona"
          element={
            <ProtectedRoute>
              <Layout>
                <Persona />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/persona/create"
          element={
            <ProtectedRoute>
              <Layout>
                <PersonaCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/persona/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                <PersonaEdit />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Rutas para Coordinador */}
        <Route
          path="/coordinador"
          element={
            <ProtectedRoute>
              <Layout>
                <Coordinador />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Docente */}
        <Route
          path="/docente"
          element={
            <ProtectedRoute>
              <Layout>
                <Docente />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/docente/create"
          element={
            <ProtectedRoute>
              <Layout>
                <DocenteCreate />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Horario */}
        <Route
          path="/horario"
          element={
            <ProtectedRoute>
              <Layout>
                <HorarioFullCalendar/>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Pagina 404 */}
        <Route path="*" element={<NotPage />} />
      </Routes>
    </>
  );
}
