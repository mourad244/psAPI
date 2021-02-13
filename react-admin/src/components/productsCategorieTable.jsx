import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class ProductsCategorieTable extends Component {
  columns = [
    {
      path: "name",
      label: "name",
      content: (productCategorie) => (
        <Link to={`/productsCategorie/${productCategorie._id}`}>
          {productCategorie.name}
        </Link>
      ),
    },
    { path: "description", label: "Description" },
    { path: "images", label: "Images" },
    {
      key: "delete",
      content: (productCategorie) => (
        <button
          onClick={() => this.props.onDelete(productCategorie)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];
  render() {
    const { productsCategorie, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={productsCategorie}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default ProductsCategorieTable;
