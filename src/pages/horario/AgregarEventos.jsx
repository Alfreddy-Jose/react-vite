import React, { useState, useEffect } from "react";
import { Api } from "../../services/Api";
import { AlertaError } from "../../components/Alert";

export default function AgregarEventoHorario({ dias, bloques, onAgregar }) {
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    materia: "",
    profesor: "",
    aula: "",
    dia: "",
    bloque: "",
    duracion: 1,
  });

  useEffect(() => {
    Api.get("/materias").then((res) => setMaterias(res.data));
    Api.get("/profesores").then((res) => setProfesores(res.data));
    Api.get("/aulas").then((res) => setAulas(res.data));
  }, []);

  const handleChange = (e) => {
    setNuevoEvento({ ...nuevoEvento, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !nuevoEvento.materia ||
      !nuevoEvento.profesor ||
      !nuevoEvento.aula ||
      !nuevoEvento.dia ||
      nuevoEvento.bloque === ""
    ) {
      AlertaError("Completa todos los campos");
      return;
    }
    // Envía el evento al padre
    onAgregar({
      ...nuevoEvento,
      bloque: parseInt(nuevoEvento.bloque),
      duracion: parseInt(nuevoEvento.duracion),
      texto:
        `${materias.find((m) => m.id == nuevoEvento.materia)?.nombre || ""}\n` +
        `${
          profesores.find((p) => p.id == nuevoEvento.profesor)?.nombre || ""
        }\n` +
        `${aulas.find((a) => a.id == nuevoEvento.aula)?.nombre || ""}`,
      color: "#e3f2fd",
      id: Date.now().toString(),
    });
    setNuevoEvento({
      materia: "",
      profesor: "",
      aula: "",
      dia: "",
      bloque: "",
      duracion: 1,
    });
  };

  return (
    <form className="mb-4 d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
      <select
        name="materia"
        value={nuevoEvento.materia}
        onChange={handleChange}
        required
      >
        <option value="">Materia</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <select
        name="profesor"
        value={nuevoEvento.profesor}
        onChange={handleChange}
        required
      >
        <option value="">Profesor</option>
        {profesores.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
      <select
        name="aula"
        value={nuevoEvento.aula}
        onChange={handleChange}
        required
      >
        <option value="">Aula</option>
        {aulas.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre}
          </option>
        ))}
      </select>
      <select
        name="dia"
        value={nuevoEvento.dia}
        onChange={handleChange}
        required
      >
        <option value="">Día</option>
        {dias.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        name="bloque"
        value={nuevoEvento.bloque}
        onChange={handleChange}
        required
      >
        <option value="">Bloque</option>
        {bloques.map((b) => (
          <option key={b.id} value={b.id}>
            {b.rango} {b.periodo}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="duracion"
        min={1}
        max={bloques.length}
        value={nuevoEvento.duracion}
        onChange={handleChange}
        style={{ width: 60 }}
        required
      />
      <button type="submit" className="btn btn-primary">
        Agregar
      </button>
    </form>
  );
}
