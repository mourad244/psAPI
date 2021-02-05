import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class MilitairesTable extends Component {
  columns = [
    {
      path: "nom",
      label: "Nom",
      content: (militaire) => (
        <Link to={`/militaires/${militaire._id}`}>{militaire.nom}</Link>
      ),
    },
    { path: "prenom", label: "Prenom" },
    { path: "grade", label: "Grade" },
    { path: "mle", label: "Matricule" },
    { path: "uniteOrigine", label: "Unité Origine" },
    { path: "fonction.nom", label: "Fonction" },
    {
      key: "delete",
      content: (militaire) => (
        <button
          onClick={() => this.props.onDelete(militaire)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];

  render() {
    const { militaires, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={militaires}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default MilitairesTable;
