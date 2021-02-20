import React, { Component } from "react";
import ProductsCategorieTable from "./productsCategorieTable";
import ProductCategorieForm from "./productCategorieForm";
import Pagination from "../common/pagination";
import {
  getProductsCategorie,
  deleteProductCategorie,
} from "../services/productCategorieService";
import { paginate } from "../utils/paginate";
import SearchBox from "../common/searchBox";
import { toast } from "react-toastify";
import _ from "lodash";

class ProductsCategorie extends Component {
  state = {
    formDisplay: false,
    productsCategorie: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data: productsCategorie } = await getProductsCategorie();

    this.setState({ productsCategorie });
  }

  handleDelete = async (productCategorie) => {
    const originalProductsCategorie = this.state.productsCategorie;
    const productsCategorie = originalProductsCategorie.filter(
      (m) => m._id !== productCategorie._id
    );
    this.setState({ productsCategorie });

    try {
      await deleteProductCategorie(productCategorie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("productCategorie déja supprimé");
      this.setState({ productsCategorie: originalProductsCategorie });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) =>
    this.setState({
      searchQuery: query,
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
      searchQuery,
      productsCategorie: allProductsCategorie,
    } = this.state;

    let filtered = allProductsCategorie;
    if (searchQuery)
      filtered = allProductsCategorie.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const productsCategorie = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: productsCategorie };
  };

  render() {
    const { length: count } = this.state.productsCategorie;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <h2>aucune categorie de produit dans la base de donnée</h2>

          {user && (
            <ProductCategorieForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
        </div>
      );

    const { totalCount, data: productsCategorie } = this.getPagedData();
    return (
      <div className="row">
        {/* <div className="col-3">
        
        </div> */}
        <div className="col">
          <h3>
            il ya {totalCount} categorie de produits dans la base de données
          </h3>
          {user && (
            <ProductCategorieForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ProductsCategorieTable
            productsCategorie={productsCategorie}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></ProductsCategorieTable>
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

export default ProductsCategorie;
