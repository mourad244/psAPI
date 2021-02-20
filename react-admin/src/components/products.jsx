import React, { Component } from "react";

import { getProducts, deleteProduct } from "../services/productService";
import { getProductsType } from "../services/productTypeService";

import ProductsTable from "./productsTable";
import ProductForm from "./productForm";
import Pagination from "../common/pagination";
import ListGroup from "../common/listGroup";

import SearchBox from "../common/searchBox";

import { paginate } from "../utils/paginate";

import { toast } from "react-toastify";

import _ from "lodash";

class Products extends Component {
  state = {
    formDisplay: false,
    products: [],
    types: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    selectedType: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getProductsType();
    const types = [{ _id: "", name: "Tous les types" }, ...data];

    const { data: products } = await getProducts();

    this.setState({ products, types });
  }

  handleDelete = async (product) => {
    const originalProducts = this.state.products;
    const products = originalProducts.filter((m) => m._id !== product._id);
    this.setState({ products });

    try {
      await deleteProduct(product._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("product déja supprimé");
      this.setState({ products: originalProducts });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleTypeSelect = (type) => {
    this.setState({
      selectedType: type,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (query) =>
    this.setState({
      searchQuery: query,
      selectedType: null,
      currentPage: 1,
    });

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  toggleForm = () => {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedType,
      searchQuery,
      products: allProducts,
    } = this.state;

    let filtered = allProducts;
    if (searchQuery)
      filtered = allProducts.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedType && selectedType._id) {
      filtered = allProducts.filter((m) => m.type._id === selectedType._id);
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const products = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: products };
  };

  render() {
    const { length: count } = this.state.products;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <h2>aucun produit dans la base de donnée</h2>
          {user && (
            <ProductForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
        </div>
      );

    const { totalCount, data: products } = this.getPagedData();
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.types}
            selectedItem={this.state.selectedType}
            onItemSelect={this.handleTypeSelect}
          ></ListGroup>
        </div>
        <div className="col">
          <h3>il ya {totalCount} produits dans la base de données</h3>
          {user && (
            <ProductForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ProductsTable
            products={products}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></ProductsTable>
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          ></Pagination>
        </div>
      </div>
    );
  }
}

export default Products;
