import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductsTable from "./productsTable";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import { getProducts, deleteProduct } from "../services/productService";
import { getTypes } from "../services/typeService";
import { paginate } from "../utils/paginate";
import SearchBox from "../common/searchBox";
import _ from "lodash";

class Products extends Component {
  state = {
    products: [],
    types: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedType: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getTypes();
    const types = [{ _id: "", name: "Tous les types" }, ...data];

    const { data: products } = await getProducts();
    // products.forEach((product) => {
    //   delete product.avis;
    // });
    // console.log(products);
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

    if (count === 0) return <p>aucun product dans la base de donnée</p>;

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
          {user && (
            <Link
              to={"/products/new"}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              Nouveau Produit
            </Link>
          )}

          <p>il ya {totalCount} produits dans la base de données</p>
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
