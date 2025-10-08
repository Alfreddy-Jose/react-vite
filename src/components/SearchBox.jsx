import React, { useState, useMemo } from "react";
import style from"../styles/SearchBox.module.css";

export const SearchBox = ({
  data,
  onFilteredData,
  searchFields,
  placeholder = "Buscar...",
  showStats = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado simple sin hook complejo
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = getNestedValue(item, field);
        return value?.toString().toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchFields]);

  // Notificar al componente padre cuando cambian los datos filtrados
  React.useEffect(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  const stats = {
    total: data.length,
    filtered: filteredData.length,
    isFiltered: searchTerm.length > 0,
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className={style.searchContainer}>
      <div className={style.searchInputWrapper}>
        {/* <span className="search-icon"></span> */}
        <input
          type="text"
          className={style.searchInput}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className={style.searchClear} onClick={handleClear} type="button">
            ✕
          </button>
        )}
      </div>

      {showStats && stats.isFiltered && (
        <div className="search-stats">
          Mostrando {stats.filtered} de {stats.total} registros
          {stats.filtered === 0 && (
            <span className="no-results"> - No se encontraron resultados</span>
          )}
        </div>
      )}
    </div>
  );
};

// Helper para valores anidados (el mismo que antes)
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
