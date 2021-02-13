import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductsTypeTable from "./productsTypeTable";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import {
  getProductsType,
  deleteProductType,
} from "../services/productTypeService";
import { getProductsCategorie } from "../services/productCategorieService";
import { paginate } from "../utils/paginate";
import SearchBox from "../common/searchBox";
import _ from "lodash";

class ProductsType extends Component {
  state = {
    productsType: [],
    categories: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedCategorie: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getProductsCategorie();
    const categories = [{ _id: "", name: "Tous les categories" }, ...data];

    const { data: productsType } = await getProductsType();
    // productsType.forEach((productType) => {
    //   delete productType.avis;
    // });
    // console.log(productsType);
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

    if (count === 0) return <p>aucun productType dans la base de donnée</p>;

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
          {user && (
            <Link
              to={"/productsType/new"}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              Nouveau Type de Produit
            </Link>
          )}

          <p>il ya {totalCount} type de produits dans la base de données</p>
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
