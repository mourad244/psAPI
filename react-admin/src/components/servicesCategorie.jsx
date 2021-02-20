import React, { Component } from "react";
import { toast } from "react-toastify";
import ServicesCategorieTable from "./servicesCategorieTable";
import Pagination from "../common/pagination";
import {
  getServicesCategorie,
  deleteServiceCategorie,
} from "../services/serviceCategorieService";
import { paginate } from "../utils/paginate";
import SearchBox from "../common/searchBox";
import _ from "lodash";
import ServiceCategorieForm from "./serviceCategorieForm";

class ServicesCategorie extends Component {
  state = {
    formDisplay: false,
    servicesCategorie: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data: servicesCategorie } = await getServicesCategorie();

    this.setState({ servicesCategorie });
  }

  handleDelete = async (serviceCategorie) => {
    const originalServicesCategorie = this.state.servicesCategorie;
    const servicesCategorie = originalServicesCategorie.filter(
      (m) => m._id !== serviceCategorie._id
    );
    this.setState({ servicesCategorie });

    try {
      await deleteServiceCategorie(serviceCategorie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("serviceCategorie déja supprimé");
      this.setState({ servicesCategorie: originalServicesCategorie });
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
      servicesCategorie: allServicesCategorie,
    } = this.state;

    let filtered = allServicesCategorie;
    if (searchQuery)
      filtered = allServicesCategorie.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const servicesCategorie = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: servicesCategorie };
  };

  render() {
    const { length: count } = this.state.servicesCategorie;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <h2>aucune categorie de service dans la base de donnée</h2>
          {user && (
            <ServiceCategorieForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
        </div>
      );

    const { totalCount, data: servicesCategorie } = this.getPagedData();
    return (
      <div className="row">
        {/* <div className="col-3">
        
        </div> */}
        <div className="col">
          <h3>
            il ya {totalCount} categories de service dans la base de données
          </h3>
          {user && (
            <ServiceCategorieForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ServicesCategorieTable
            servicesCategorie={servicesCategorie}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></ServicesCategorieTable>
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

export default ServicesCategorie;
