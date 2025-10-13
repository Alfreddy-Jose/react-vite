import { Create } from "../../components/Link";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { useEffect } from "react";
import Api, { GetAll } from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Modal, { ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";
import { Buttom } from "../../components/Buttom";
import ImportLaboratoriosModal from "../../components/import_modal/ImportLaboratorios";

export default function Laboratorios() {
  const [loading, setLoading] = useState(true);
  const [laboratorios, setLaboratorios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [laboratoriosFiltrados, setLaboratoriosFiltrados] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const location = useLocation();

  // Función para manejar éxito de importación
  const handleImportSuccess = (importedCount) => {
    console.log(`Se importaron ${importedCount} aulas correctamente`);
    // Recargar datos o actualizar el estado aquí
    GetAll(setLaboratorios, setLoading, "/laboratorios");

    Alerta(`Se importaron ${importedCount} laboratorios correctamente`);
  };

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["codigo", "nombre_aula", "sede.nombre_sede"];
  // Inicializar datos filtrados
  useEffect(() => {
    setLaboratoriosFiltrados(laboratorios);
  }, [laboratorios]);

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setLaboratorios, setLoading, "/laboratorios");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

      const descargarPDF = async () => {
        try {
          const response = await Api.get("/laboratorio/pdf", {
            responseType: "blob",
            withCredentials: true,
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "laboratorio.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          AlertaError("Error al descargar el PDF");
          console.error(error);
        }
      };

  const columns = [
    { name: "ID", selector: (row, index) => index + 1, sortable: true },
    { name: "ETAPA", selector: (row) => row.etapa, sortable: true },
    { name: "NOMBRE", selector: (row) => row.nombre_aula, sortable: true },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.abreviado_lab}`} id={row.id}>
            <p>
              <b>NOMBRE: </b> {row.nombre_aula}
            </p>
            <p>
              <b>ETAPA: </b> {row.etapa}
            </p>
            <p>
              <b>ABREVIADO: </b> {row.abreviado_lab}
            </p>
            <p>
              <b>EQUIPOS: </b> {row.equipos}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("laboratorio.editar") ||
    permisos.includes("laboratorio.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/laboratorio/${row.id}/edit`}
                urlDelete={`/laboratorio/${row.id}`}
                navegar="/laboratorio"
                editar="laboratorio.editar"
                eliminar="laboratorio.eliminar"
              />
            ),
          },
        ] 
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="LABORATORIO"
        // Propiedades para el buscador
        data={laboratorios}
        searchData={laboratorios}
        onSearchFiltered={setLaboratoriosFiltrados}
        searchFields={camposBusqueda}
        placeholder="BUSCAR..."
        showStats={true}
        // Boton para generar PDF
        button_pdf={
          permisos.includes("laboratorio.pdf") ?
          (<Buttom 
            type="button"
            style="btn btn-danger mb-3"
            onClick={descargarPDF}
            title="Generar PDF"
            text="Generar PDF"
          />) : null
        }
        button_modal={
          // permisos.includes("aula.importar") ? (
            <>  
              <Buttom
                type="button"
                style="btn btn-success mb-3 mx-2"
                onClick={() => setIsImportModalOpen(true)}
                title="Importar desde Excel"
                text="Importar desde Excel"
              />
              <ImportLaboratoriosModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={handleImportSuccess}
              />
            </>
          // ) : null

        }
        // Boton para crear nuevos registros
        link={
          permisos.includes("laboratorio.crear") ? (
            <Create path="/laboratorio/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={laboratoriosFiltrados} />}
        // mostrando sniper cuando se cargan los datos
        isLoading={loading}
      />
    </>
  );
}
