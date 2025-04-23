import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";

DataTable.use(DT);

function Prueba({ children, c1, c2, c3, c4}) {

  return (
    <DataTable className="display text-center table-bordered table table-striped table-hover">
      <thead>
        <tr>
          <th>{ c1 }</th>
          <th>{ c2 }</th>
          <th>{ c3 }</th>
          <th>{ c4 }</th>
        </tr>
      </thead>
      <tbody>
        { children }
      </tbody>
    </DataTable>
  );
}

export default Prueba;
