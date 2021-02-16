import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class ServicesTable extends Component {
  columns = [
    {
      path: "name",
      label: "name",
      content: (service) => (
        <Link to={`/services/${service._id}`}>{service.name}</Link>
      ),
    },
    { path: "desc1", label: "Desc1" },
    { path: "desc2", label: "Desc2" },
    { path: "caracteristiques", label: "Caracteristiques" },
    { path: "images", label: "Images" },
    { path: "accessoires", label: "Accessoires" },
    {
      key: "delete",
      content: (service) => (
        <button
          onClick={() => this.props.onDelete(service)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];
  render() {
    const { services, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={services}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default ServicesTable;
