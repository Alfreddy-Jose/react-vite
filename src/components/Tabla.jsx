import DataTable from "react-data-table-component";
import { useState, useMemo } from "react";

const paginacionOpciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Tabla({ columns, data, searchFields = [] }) {
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Función de filtrado
  const filteredItems = useMemo(() => {
    if (!filterText) return data;

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value
          ?.toString()
          .toLowerCase()
          .includes(filterText.toLowerCase());
      })
    );
  }, [data, filterText, searchFields]);

  // Componente de búsqueda
  const SubHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <div className="d-flex align-items-center">
        <div className="input-group" style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleClear}
              style={{
                height: "41px", // Igual a la altura del input de Bootstrap
                padding: "0 12px", // Padding horizontal estándar
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              tabIndex={-1}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div>
      <DataTable
        className="table-responsive"
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        paginationComponentOptions={paginacionOpciones}
        fixedHeader
        fixedHeaderScrollHeight="600px"
        noDataComponent="No hay datos disponibles"
        subHeader
        subHeaderComponent={SubHeaderComponent}
      />
    </div>
  );
}

// Helper para valores anidados (el mismo que tenías en SearchBox)
function getNestedValue(obj, path) {
  if (!path) return obj;
  return path.split(".").reduce((current, key) => {
    if (current == null) return null;
    const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch;
      return current[arrayKey]?.[parseInt(index)];
    }
    return current[key];
  }, obj);
}
