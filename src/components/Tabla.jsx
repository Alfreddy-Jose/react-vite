import DataTable from "react-data-table-component";

const paginacionObciones = {
  rowsPerPageText: "Filas por Páginas",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

export function Tabla({columns, data}) {

  return (
    <div>
      <DataTable
        className="table-responsive"
        columns={columns}
        data={data}
        pagination
        paginationComponentOptions={paginacionObciones}
        fixedHeader
        fixedHeaderScrollHeight="600px"
      />
    </div>
  );
}
