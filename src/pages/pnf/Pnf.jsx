import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api, { GetAll } from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import { Modal, ButtomModal } from "../../components/Modal";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { useFormik } from "formik";
import Spinner from "../../components/Spinner";
import { CardCheckbox } from "../../components/CardCheckbox";

export function Pnf() {
  const [pnf, setPnf] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de PNF
    GetAll(setPnf, setLoading, "/pnf");

    // Trayendo los datos del registro
    const getEspacios = async () => {
      const response = await Api.get(`pnf/espacios`);
      setEspacios(response.data);
    };

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    getEspacios();

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
      sortable: false,
    },
    {
      name: "CODIGO",
      selector: (row) => row.codigo,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
      grow: 3,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id}>
            <p>
              <b>CODIGO: </b> {row.codigo}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre}
            </p>
            <p>
              <b>ABREVIADO: </b> {row.abreviado}
            </p>
            <p>
              <b>ABREVIADO COORDINACIÓN: </b>
              {row.abreviado_coord}
            </p>
          </Modal>
        </div>
      ),
    },
    // Nueva columna para asignar espacios
    {
      name: "ESPACIOS",
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
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("pnf.editar") || permisos.includes("pnf.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/pnf/${row.id}/edit`}
                urlDelete={`/pnf/${row.id}`}
                navegar="/pnf"
                editar="pnf.editar"
                eliminar="pnf.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

/*   const onSubmit = async (values) => {
    console.log(values);
  }; */

/*   const formik = useFormik({
    initialValues: {
      pnf: "",
      espacios: "",
    },
    //validationSchema,
    onSubmit,
  }); */

  return (
    <>
      {/* Contenedor para la tablas de PNF */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="PNF"
        // Boton para crear nuevos registros
        link={
          permisos.includes("pnf.crear") ? (
            <Create
              path="/pnf/create"
              /* button={ */
                /*                 <>
                  <ButtomModal
                    style="btn btn-success traslation mx-2 mb-4"
                    text="Asignar Espacios"
                    id="asignar_aulas"
                  /> */
/*                 <Modal
                  id="asignar_aulas"
                  titleModal="Asignar Espacios"
                  button_aceptar={
                    <button className="btn btn-success traslation" id="form">
                      Asignar
                    </button>
                  }
                ></Modal>
              } */
            />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={pnf} />}
      />
    </>
  );
}

// Componenete para Modal de Asignar Espacios
export function ModalAsignarPnfs({ id }) {
  // Estados para el modal de pnf
  const [espaciosDisponibles, setEspaciosDisponibles] = useState([]);
  const [espaciosAsignados, setEspaciosAsignados] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const navegation = useNavigate();

  const formik = useFormik({
    initialValues: {
      selectEspacios: [],
    },
    // Funcion para enviar al backend
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const payload = {
          espacios_ids: values.selectEspacios,
        };
        console.log(payload);
        
        const response = await Api.post(`/espacios/${id}/asignarEspacios`, payload);
        // Navegar con mensaje de éxito
        navegation("/pnf", {
          state: {
            message: response.data.message,
          },
        });
      } catch (error) {
        AlertaError("Error al asignar Espacios");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchPnfData = async () => {
      try {
        setLoading(true);
        setError(null);

        const allEspaciosAsignados = await Api.get(`/pnf/${id}/espacios`);
        const allEspaciosDisponibles = await Api.get("/pnf/espacios");

        setEspaciosDisponibles(allEspaciosDisponibles.data || []);
        setEspaciosAsignados(allEspaciosAsignados.data || []);

        // Inicializar con IDs de PNFs ya asignados
        formik.setFieldValue(
          "selectEspacios",
          allEspaciosAsignados.data?.map((espacios) => espacios.id) || []
        );
      } catch (error) {
        console.error("Error fetching Espacios data:", error);
        setError("Error al cargar los Espacios. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPnfData();
  }, [id]);
  // EDN de useEffect

  const handleEspaciosChange = (espacioId) => {
    const newSelectEspacios = formik.values.selectEspacios?.includes(espacioId)
      ? formik.values.selectEspacios.filter((id) => id !== espacioId)
      : [...(formik.values.selectEspacios || []), espacioId];

    formik.setFieldValue("selectEspacios", newSelectEspacios);
  };

  return (
    <Modal
      tamaño="modal-lg"
      titleModal={`ASIGNAR ESPACIOS`}
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
                  {espaciosDisponibles.map((espacios) => (
                    <div className="col-md-6 mb-2" key={espacios.id}>
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          name="selectEspacios"
                          value={espacios.id}
                          checked={formik.values.selectEspacios?.includes(espacios.id)}
                          onChange={() => handleEspaciosChange(espacios.id)}
                          onBlur={formik.handleBlur}
                          className="me-2"
                        />
                        {espacios.nombre_aula}
                      </label>
                    </div>
                  ))}
                </div>
              }
            />
          </form>

          {formik.errors.selectEspacios && formik.touched.selectEspacios && (
            <div className="text-danger mb-3">{formik.errors.selectEspacios}</div>
          )}

          <div className="modal-footer"></div>
        </>
      )}
    </Modal>
  );
}
