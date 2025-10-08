import Spinner from "./Spinner";
import { SearchBox } from "./SearchBox";

export function ContainerTable({
  title,
  link,
  tabla,
  isLoading = false,
  header_parametros = null,
  button_pdf = null,
  onSearchFiltered = () => {},
  searchData = [],
  searchFields = [],
  placeholder = "Buscar...",
  showStats = true,
}) {
  return (
    <div className="row">
      <div className="col-12">
        {link}
        <div className="card p-4">
          <div className="card-header">
            {header_parametros ? (
              <div className="card-title">BUSCAR POR:</div>
            ) : null}
            {header_parametros}
            {/* BOTON PDF */}
            {button_pdf} 
            <div className="card-title mb-4">{`LISTA DE ${title}`}</div>
            {/* BUSCADOR */}
            <SearchBox
              data={searchData}
              onFilteredData={onSearchFiltered}
              searchFields={searchFields}
              placeholder={placeholder}
              showStats={showStats}
            />
          </div>
          {isLoading ? <Spinner /> : tabla}
        </div>
      </div>
    </div>
  );
}
