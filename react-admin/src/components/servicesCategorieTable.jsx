import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class ServicesCategorieTable extends Component {
  columns = [
    {
      path: "name",
      label: "name",
      content: (serviceCategorie) => (
        <Link to={`/servicesCategorie/${serviceCategorie._id}`}>
          {serviceCategorie.name}
        </Link>
      ),
    },
    { path: "smallDesc", label: "Petite description" },
    // { path: "largeDesc", label: "Large description" },
    // { path: "assistance", label: "Assistance" },
    { path: "images", label: "Images" },
    {
      key: "delete",
      content: (serviceCategorie) => (
        <button
          onClick={() => this.props.onDelete(serviceCategorie)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];
  render() {
    const { servicesCategorie, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={servicesCategorie}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default ServicesCategorieTable;
