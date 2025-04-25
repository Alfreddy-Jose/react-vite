import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import React from "react";

DataTable.use(DT);

function Prueba({ data, columns}) {
console.log(data);
  return (
    <DataTable data={data} columns={columns} className="display text-center table-bordered table table-striped table-hover">

    </DataTable>
  );
}

export default Prueba;
