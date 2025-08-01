import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation, useNavigate } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import Api, { GetAll } from "../../services/Api";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";
import { CardCheckbox } from "../../components/CardCheckbox";
import { useFormik } from "formik";
import Spinner from "../../components/Spinner";

export function Sede() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);
    GetAll(setSedes, setLoading, "/sedes");

    if (location.state?.message) {
      Alerta(location.state.message);
    }
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "NÚMERO SEDE",
      selector: (row) => row.nro_sede,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre_sede,
      sortable: true,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />
          <Modal titleModal={`+INFO ${row.nombre_abreviado}`} id={row.id}>
            <p>
              <b>NÚMERO SEDE: </b> {row.nro_sede}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre_sede}
            </p>
            <p>
              <b>ABREVIADO: </b> {row.nombre_abreviado}
            </p>
            <p>
              <b>DIRECCIÓN: </b> {row.direccion}
            </p>
            <p>
              <b>MUNICIPIO: </b> {row.municipio}
            </p>
          </Modal>
        </div>
      ),
    },
    // Nueva columna para asignar carreras
    {
      name: "PNF",
      cell: (row) => (
        //permisos.includes("sede.asignar-carreras") && (
        <>
          <ButtomModal
            className="btn traslation btn-primary"
            id={`asignar${row.id}`}
            text="Asignar"
          />

          <ModalAsignarPnfs id={row.id} />
        </>
        //)
      ),
    },
    ...(permisos.includes("sede.editar") || permisos.includes("sede.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/sede/${row.id}/edit`}
                urlDelete={`/sede/${row.id}`}
                navegar="/sede"
                editar="sede.editar"
                eliminar="sede.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <ContainerTable
        title="SEDES"
        link={
          permisos.includes("sede.crear") ? (
            <Create path="/sede/create" />
          ) : null
        }
        isLoading={loading}
        tabla={<Tabla data={sedes} columns={columns} />}
      />
    </>
  );
}

// Componenete para Modal de Asignar pnf
export function ModalAsignarPnfs({ id }) {
  // Estados para el modal de pnf
  const [pnfsDisponibles, setPnfsDisponibles] = useState([]);
  const [pnfsAsignados, setPnfsAsignados] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const navegation = useNavigate();

  const formik = useFormik({
    initialValues: {
      selectedPnfs: [],
    },
    // Funcion para enviar al backend
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const payload = {
          pnf_ids: values.selectedPnfs,
        };
        const response = await Api.post(`/sedes/${id}/asignarPnfs`, payload);
        // Navegar con mensaje de éxito
        navegation("/sede", {
          state: {
            message: response.data.message,
          },
        });
      } catch (error) {
        AlertaError("Error al asignar PNFs");
      } finally {
        setLoading(false);
      }
      console.log(values);
      
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchPnfData = async () => {
      try {
        setLoading(true);
        setError(null);

        const allPnfsAsignados = await Api.get(`/sedes/${id}/pnf`);
        const allPnfsDisponibles = await Api.get("/sede/getPnf");

        setPnfsDisponibles(allPnfsDisponibles.data || []);
        setPnfsAsignados(allPnfsAsignados.data || []);

        // Inicializar con IDs de PNFs ya asignados
        formik.setFieldValue(
          "selectedPnfs",
          allPnfsAsignados.data?.map((pnf) => pnf.id) || [],
        );

      } catch (error) {
        console.error("Error fetching PNF data:", error);
        setError("Error al cargar los PNFs. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPnfData();
  }, [id]);
  // END de useEffect

  const handlePnfChange = (pnfId) => {
    const newSelectedPnfs = formik.values.selectedPnfs?.includes(pnfId)
      ? formik.values.selectedPnfs.filter((id) => id !== pnfId)
      : [...(formik.values.selectedPnfs || []), pnfId];

    formik.setFieldValue("selectedPnfs", newSelectedPnfs);
  };

  return (
    <Modal
      tamaño="modal-lg"
      titleModal={`ASIGNAR PNF`}
      id={`asignar${id}`}
      button_aceptar={
        <button
          form={`botonModal${id}`}
          type="submit"
          className="btn btn-primary traslation"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Asignación"}
        </button>
      }
    >
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <form onSubmit={formik.handleSubmit} id={`botonModal${id}`}>
            <CardCheckbox
              title={`SELECCIONE PNF PARA ASIGNAR`}
              checkbox={
                <div className="row">
                  {pnfsDisponibles.map((pnf) => (
                    <div className="col-md-6 mb-2" key={pnf.id}>
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          name="selectedPnfs"
                          value={pnf.id}
                          checked={formik.values.selectedPnfs?.includes(pnf.id)}
                          onChange={() => handlePnfChange(pnf.id)}
                          onBlur={formik.handleBlur}
                          className="me-2"
                        />
                        {pnf.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              }
            />
          </form>

          {formik.errors.selectedPnfs && formik.touched.selectedPnfs && (
            <div className="text-danger mb-3">{formik.errors.selectedPnfs}</div>
          )}

          <div className="modal-footer"></div>
        </>
      )}
    </Modal>
  );
}
