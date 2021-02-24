import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";

class ProductsTable extends Component {
  columns = [
    {
      path: "name",
      label: "name",
      content: (product) => (
        <Link to={`/products/${product._id}`}>{product.name}</Link>
      ),
    },
    { path: "type.name", label: "Type" },
    // { path: "description", label: "Description" },
    { path: "images", label: "Images" },

    {
      key: "delete",
      content: (product) => (
        <button
          onClick={() => this.props.onDelete(product)}
          className="btn btn-danger btn-sm"
        >
          Supprimer
        </button>
      ),
    },
  ];

  render() {
    const { products, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={products}
        sortColumn={sortColumn}
        onSort={onSort}
      ></Table>
    );
  }
}

export default ProductsTable;
