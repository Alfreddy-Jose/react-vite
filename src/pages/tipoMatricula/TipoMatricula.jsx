import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Prueba from "../../components/TablaPrue";
import { Link, useLocation } from "react-router-dom";
import Api from "../../services/Api";
import Alerta from "../../components/Alert";

export function TipoMatricula() {

  const [matricula, setMatricula] = useState([]);
  const location = useLocation();

  useEffect(() => {

    // Mostrar la lista de PNF
    getAllMatriculas();

    // Motrar Alerta al registrar unm nuevo tipop de matricula
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");

  }, [location.state]);

  const getAllMatriculas = async () => {
    const response = await Api.get(`/matriculas`);
    setMatricula(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="TIPO MATRICULA"
        // Boton para crear nuevos registros
        link={<Create path="/tipo_matricula/create" />}
        // Tabla
        tabla={<Prueba c1="ID" c2="NOMBRE" c3="TIPO" c4="ACCIONES">
            { matricula.map((matricula) => (
              <tr key={matricula.id}>
                <td>{ matricula.id }</td>
                <td>{ matricula.nombre }</td>
                <td>{ matricula.tipo }</td>
                <td>
                  <Link to={`/tipo_matricula/${matricula.id}/edit`} className="btn btn-primary" >Editar</Link>
                  <button className="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            )) }
        </Prueba>}
      />
    </>
  );
}
