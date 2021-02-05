import React, { Component } from "react";
import Table from "../common/table";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import "moment-timezone";

class PermissionsTable extends Component {
  // numbreDays(permission) {
  //   return (permission.type = "detente" ? 20 : 10);
  // }
  columns = [
    {
      path: "militaire.nom",
      label: "Nom",
    },
    { path: "militaire.prenom", label: "Prenom" },
    { path: "militaire.grade", label: "Grade" },
    { path: "type", label: "Type" },
    {
      path: "dateDepart",
      label: "Date Depart",
      date: (permission) => {
        if (permission.dateDepart != undefined)
          return (
            <Moment
              date={
                permission.dateDepart != undefined
                  ? permission.dateDepart
                  : null
              }
              format="DD/MM/YYYY"
            >
              {permission.dateDepart}
            </Moment>
          );
        // return Moment;
      },
    },
    {
      path: "dateArrivee",
      label: "Date Rejoint",
      date: (permission) => {
        if (permission.dateDepart != undefined)
          return (
            <Moment
              date={permission.dateArrivee}
              // add={{ days: permission.type === "detente" ? 20 : 8 }}
              format="DD/MM/YYYY"
            ></Moment>
          );
      },
    },
    {
      key: "ajouter",
      content: (permission) => (
        <Link to={`/permissions/${permission.militaire._id}`}>
          <button
            // onClick={() => this.props.onAdd(permission)}
            className="btn btn-primary btn-sm"
          >
            Ajouter
          </button>
        </Link>
      ),
    },
    {
      key: "modifier",
      content: (permission) => (
        <Link to={`/permissions/${permission.militaire._id}`}>
          <button
            // onClick={() => this.props.onModify(permission)}
            className="btn btn-warning btn-sm"
          >
            Modifier
          </button>
        </Link>
      ),
    },
    {
      key: "delete",
      content: (permission) => (
        <button
          onClick={() => this.props.onDelete(permission)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];
  render() {
    const { permissions, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={permissions}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PermissionsTable;
