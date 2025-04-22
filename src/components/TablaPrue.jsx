import { useState } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";

DataTable.use(DT);

function Prueba() {
  const [tableData, setTableData] = useState([
    ["Tiger Nixon", "System Architect"],
    ["Garrett Winters", "Accountant"],
    // ...
  ]);

  return (
    <DataTable data={tableData} className="table display">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
        </tr>
      </thead>
    </DataTable>
  );
}

export default Prueba;
