import React, { Component } from "react";
import {
  getProductsType,
  deleteProductType,
} from "../services/productTypeService";
import ProductsTypeTable from "./productsTypeTable";
import { getProductsCategorie } from "../services/productCategorieService";
import ProductTypeForm from "./productTypeForm";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import SearchBox from "../common/searchBox";
import { paginate } from "../utils/paginate";
import { toast } from "react-toastify";
import _ from "lodash";

class ProductsType extends Component {
  state = {
    formDisplay: false,
    productsType: [],
    categories: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    selectedCategorie: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getProductsCategorie();
    const categories = [{ _id: "", name: "Tous les categories" }, ...data];

    const { data: productsType } = await getProductsType();

    this.setState({ productsType, categories });
  }

  handleDelete = async (productType) => {
    const originalProductsType = this.state.productsType;
    const productsType = originalProductsType.filter(
      (m) => m._id !== productType._id
    );
    this.setState({ productsType });

    try {
      await deleteProductType(productType._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("productType déja supprimé");
      this.setState({ productsType: originalProductsType });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleCategorieSelect = (categorie) => {
    this.setState({
      selectedCategorie: categorie,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (query) =>
    this.setState({
      searchQuery: query,
      selectedCategorie: null,
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
      selectedCategorie,
      searchQuery,
      productsType: allProductsType,
    } = this.state;

    let filtered = allProductsType;
    if (searchQuery)
      filtered = allProductsType.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategorie && selectedCategorie._id) {
      filtered = allProductsType.filter(
        (m) => m.categorie._id === selectedCategorie._id
      );
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const productsType = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: productsType };
  };

  render() {
    const { length: count } = this.state.productsType;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <h2>aucun type de produit dans la base de donnée</h2>
          {user && (
            <ProductTypeForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
        </div>
      );

    const { totalCount, data: productsType } = this.getPagedData();
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.categories}
            selectedItem={this.state.selectedCategorie}
            onItemSelect={this.handleCategorieSelect}
          ></ListGroup>
        </div>
        <div className="col">
          <h3>il ya {totalCount} types de produit dans la base de données</h3>
          {user && (
            <ProductTypeForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ProductsTypeTable
            productsType={productsType}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></ProductsTypeTable>
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

export default ProductsType;
