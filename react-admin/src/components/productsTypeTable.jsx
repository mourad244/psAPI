import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class ProductsTypeTable extends Component {
  columns = [
    {
      path: "name",
      label: "name",
      content: (productType) => (
        <Link to={`/productsType/${productType._id}`}>{productType.name}</Link>
      ),
    },
    { path: "categorie.name", label: "Categorie" },
    { path: "description", label: "Description" },
    { path: "images", label: "Images" },
    {
      key: "delete",
      content: (productType) => (
        <button
          onClick={() => this.props.onDelete(productType)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];
  render() {
    const { productsType, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={productsType}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default ProductsTypeTable;
