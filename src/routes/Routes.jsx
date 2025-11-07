import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import Coordinador from "../pages/Coordinador/Coordinador";
import Docente from "../pages/docente/Docente";
import DocenteCreate from "../pages/docente/DocenteCreate";
import AulasEdit from "../pages/espacios/AulaEdit";
import Aulas from "../pages/espacios/Aulas";
import AulasCreate from "../pages/espacios/AulasCreate";
import LaboratoriosCreate from "../pages/espacios/LaboratorioCreate";
import LaboratorioEdit from "../pages/espacios/LaboratorioEdit";
import Laboratorios from "../pages/espacios/Laboratorios";
import { Horarios } from "../pages/horario/Horario";
import { HorarioCreate } from "../pages/horario/HorarioCreate";
import { LapsoAcademico } from "../pages/lapsoAcademico/LapsoAcademico";
import { LapsoAcademicoCreate } from "../pages/lapsoAcademico/LapsoAcademicoCreate";
import { LapsoAcademicoEdit } from "../pages/lapsoAcademico/LapsoAcademicoEdit";
import { Login } from "../pages/Login";
import NotPage from "../pages/Page404";
import { Panel } from "../pages/Panel";
import Persona from "../pages/persona/Persona";
import PersonaCreate from "../pages/persona/PersonaCreate";
import PersonaEdit from "../pages/persona/PersonaEdit";
import { Pnf } from "../pages/pnf/Pnf";
import { PnfCreate } from "../pages/pnf/PnfCreate";
import PnfEdit from "../pages/pnf/PnfEdit";
import Roles from "../pages/roles/Roles";
import RolesCreate from "../pages/roles/RolesCreate";
import RolesEdit from "../pages/roles/RolesEdit";
import { Secciones } from "../pages/secciones/Secciones";
import { SeccionesCreate } from "../pages/secciones/SeccionesCreate";
import { Sede } from "../pages/sede/Sede";
import { SedeCreate } from "../pages/sede/SedeCreate";
import { SedeEdit } from "../pages/sede/SedeEdit";
import { TipoMatriculaEdit } from "../pages/tipoMatricula/MatriculaEdit";
import { TipoMatricula } from "../pages/tipoMatricula/TipoMatricula";
import { TipoMatriculaCreate } from "../pages/tipoMatricula/TipoMatriculaCreate";
import Trayecto from "../pages/trayectos/Trayecto";
import TrayectoCreate from "../pages/trayectos/TrayectoCreate";
import Turno from "../pages/turnos/Turno";
import TurnoCreate from "../pages/turnos/TurnoCreate";
import UnidadCurricular from "../pages/unidad_curricular/UnidadCurricular";
import UnidadCurricularCreate from "../pages/unidad_curricular/UnidadCurricularCreate";
import UnidadCurricularEdit from "../pages/unidad_curricular/UnidadCurricularEdit";
import { Universidad } from "../pages/universidad/Universidad";
import { Usuario } from "../pages/usuario/Usuario";
import { UsuarioCreate } from "../pages/usuario/UsuarioCreate";
import UsuarioEdit from "../pages/usuario/UsuarioEdit";
import { SeccionesEdit } from "../pages/secciones/SeccionesEdit";
import DocenteEdit from "../pages/docente/DocenteEdit";
import HomePage from "../pages/HomePage";
import TrayectoEdit from "../pages/trayectos/TrayectoEdit";
import { HorarioClases } from "../pages/horario/HorarioClases";
import { HorariosDocentes } from "../pages/horario/HorarioDocente";
import Voceros from "../pages/vocero/Vocero";
import VoceroCreate from "../pages/vocero/VoceroCreate";
import VoceroEdit from "../pages/vocero/VoceroEdit";
import Unauthorized from "../pages/Unauthorized";

export function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta del Dashboard */}
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <Layout>
                <Panel />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Ruta de no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas de Usuario */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredPermission="usuario.ver">
              <Layout>
                <Usuario />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/create"
          element={
            <ProtectedRoute requiredPermission="usuario.crear">
              <Layout>
                <UsuarioCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/:id/edit"
          element={
            <ProtectedRoute
              requiredPermission="usuario.editar"
              allowSelfEdit={true}
            >
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
            <ProtectedRoute requiredPermission="pnf.ver">
              <Layout>
                <Pnf />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pnf/create"
          element={
            <ProtectedRoute requiredPermission="pnf.crear">
              <Layout>
                <PnfCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pnf/:id/edit"
          element={
            <ProtectedRoute requiredPermission="pnf.editar">
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
            <ProtectedRoute requiredPermission="sede.ver">
              <Layout>
                <Sede />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sede/create"
          element={
            <ProtectedRoute requiredPermission='sede.crear'>
              <Layout>
                <SedeCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sede/:id/edit"
          element={
            <ProtectedRoute requiredPermission='sede.editar'>
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
            <ProtectedRoute requiredPermission="lapso.ver">
              <Layout>
                <LapsoAcademico />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lapso_academico/create"
          element={
            <ProtectedRoute requiredPermission="lapso.crear">
              <Layout>
                <LapsoAcademicoCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lapso_academico/:id/edit"
          element={
            <ProtectedRoute requiredPermission="lapso.editar">
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
            <ProtectedRoute requiredPermission="trayecto.ver">
              <Layout>
                <Trayecto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trayecto/create"
          element={
            <ProtectedRoute requiredPermission="trayecto.crear">
              <Layout>
                <TrayectoCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trayecto/:id/edit"
          element={
            <ProtectedRoute requiredPermission="trayecto.editar">
              <Layout>
                <TrayectoEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Unidad Curricular */}
        <Route
          path="/unidad_curricular"
          element={
            <ProtectedRoute requiredPermission="unidad Curricular.ver">
              <Layout>
                <UnidadCurricular />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unidad_curricular/create"
          element={
            <ProtectedRoute requiredPermission="unidad Curricular.crear">
              <Layout>
                <UnidadCurricularCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/unidad_curricular/:id/edit"
          element={
            <ProtectedRoute requiredPermission="unidad Curricular.editar">
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
            <ProtectedRoute requiredPermission="Tipo Matricula.ver">
              <Layout>
                <TipoMatricula />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo_matricula/create"
          element={
            <ProtectedRoute requiredPermission="Tipo Matricula.crear">
              <Layout>
                <TipoMatriculaCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipo_matricula/:id/edit"
          element={
            <ProtectedRoute requiredPermission="Tipo Matricula.editar">
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
            <ProtectedRoute requiredPermission="seccion.ver">
              <Layout>
                <Secciones />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seccion/create"
          element={
            <ProtectedRoute requiredPermission="seccion.crear">
              <Layout>
                <SeccionesCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seccion/:id/edit"
          element={
            <ProtectedRoute requiredPermission="seccion.editar">
              <Layout>
                <SeccionesEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas de Turnos  */}
        <Route
          path="/turnos"
          element={
            <ProtectedRoute requiredPermission="turno.ver">
              <Layout>
                <Turno />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/turno/create"
          element={
            <ProtectedRoute requiredPermission="turno.crear">
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
            <ProtectedRoute requiredPermission="aula.ver">
              <Layout>
                <Aulas />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aula/create"
          element={
            <ProtectedRoute requiredPermission="aula.crear">
              <Layout>
                <AulasCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aula/:id/edit"
          element={
            <ProtectedRoute requiredPermission="aula.editar">
              <Layout>
                <AulasEdit />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio"
          element={
            <ProtectedRoute requiredPermission="laboratorio.ver">
              <Layout>
                <Laboratorios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio/create"
          element={
            <ProtectedRoute requiredPermission="laboratorio.crear">
              <Layout>
                <LaboratoriosCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorio/:id/edit"
          element={
            <ProtectedRoute requiredPermission="laboratorio.editar">
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
            <ProtectedRoute requiredPermission="rol.ver">
              <Layout>
                <Roles />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rol/create"
          element={
            <ProtectedRoute requiredPermission="rol.crear">
              <Layout>
                <RolesCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rol/:id/edit"
          element={
            <ProtectedRoute requiredPermission="rol.editar">
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
            <ProtectedRoute requiredPermission="universidad.ver">
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
            <ProtectedRoute requiredPermission="persona.ver">
              <Layout>
                <Persona />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/persona/create"
          element={
            <ProtectedRoute requiredPermission="persona.crear">
              <Layout>
                <PersonaCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/persona/:id/edit"
          element={
            <ProtectedRoute requiredPermission="persona.editar">
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
            <ProtectedRoute requiredPermission="coordinador.ver">
              <Layout>
                <Coordinador />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Docente */}
        <Route
          path="/docentes"
          element={
            <ProtectedRoute requiredPermission="docente.ver">
              <Layout>
                <Docente />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/create"
          element={
            <ProtectedRoute requiredPermission="docente.crear">
              <Layout>
                <DocenteCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/docente/:id/edit"
          element={
            <ProtectedRoute requiredPermission="docente.editar">
              <Layout>
                <DocenteEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Vocero */}
        <Route
          path="/voceros"
          element={
            <ProtectedRoute requiredPermission="vocero.ver">
              <Layout>
                <Voceros />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vocero/create"
          element={
            <ProtectedRoute requiredPermission="vocero.crear">
              <Layout>
                <VoceroCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vocero/:id/edit"
          element={
            <ProtectedRoute requiredPermission="vocero.editar">
              <Layout>
                <VoceroEdit />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rutas para Horario */}
        <Route
          path="/horarios"
          element={
            <ProtectedRoute>
              <Layout>
                <Horarios />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/horarios/create"
          element={
            <ProtectedRoute>
              <Layout>
                <HorarioCreate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/horarios/:id/clases"
          element={
            <ProtectedRoute>
              <Layout>
                <HorarioClases />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/horarios/docente"
          element={
            <ProtectedRoute>
              <Layout>
                <HorariosDocentes />
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
