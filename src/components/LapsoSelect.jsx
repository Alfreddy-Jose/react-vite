import { useAuth } from "../context/AuthContext";

const LapsoSelector = () => {
  const { lapsoActual, setLapsoActual, lapsos } = useAuth();

  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selected = lapsos.find((l) => l.id === selectedId);
    setLapsoActual(selected);
  };

  return (
    <select
      id="lapso"
      className="form-select"
      aria-label="Selección de lapso académico"
      value={lapsoActual?.id || ""}
      onChange={handleChange}
      disabled={lapsos.length === 0}
    >
      <option value="" selected disabled className="text-center">
        {lapsos.length === 0 ? "CARGANDO..." : "SELECCIONE UN LAPSO"}
      </option>
      {lapsos.map((lapso) => (
        <option key={lapso.id} value={lapso.id} className="text-center">
          {lapso.nombre_lapso} - {lapso.ano}
        </option>
      ))}
    </select>
  );
};

export default LapsoSelector;
