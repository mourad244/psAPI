import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
const Table = ({ columns, sortColumn, onSort, data, addColumn }) => {
  return (
    <table className="table">
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
      ></TableHeader>
      <TableBody columns={columns} data={data}></TableBody>
    </table>
  );
};

export default Table;
