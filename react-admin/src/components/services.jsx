import React, { Component } from "react";

import { getServices, deleteService } from "../services/serviceService";
import { getServicesCategorie } from "../services/serviceCategorieService";

import ServicesTable from "./servicesTable";
import ServiceForm from "./serviceForm";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";

import SearchBox from "../common/searchBox";

import { paginate } from "../utils/paginate";

import { toast } from "react-toastify";

import _ from "lodash";

class Services extends Component {
  state = {
    formDisplay: false,
    services: [],
    categories: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    selectedCategorie: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getServicesCategorie();
    const categories = [{ _id: "", name: "Tous les categories" }, ...data];

    const { data: services } = await getServices();

    this.setState({ services, categories });
  }

  handleDelete = async (service) => {
    const originalServices = this.state.services;
    const services = originalServices.filter((m) => m._id !== service._id);
    this.setState({ services });

    try {
      await deleteService(service._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("service déja supprimé");
      this.setState({ services: originalServices });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleCategorieSelect = (type) => {
    this.setState({
      selectedCategorie: type,
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
      services: allServices,
    } = this.state;
    let filtered = allServices;
    if (searchQuery)
      filtered = allServices.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategorie && selectedCategorie._id) {
      filtered = allServices.filter(
        (m) => m.categorie._id === selectedCategorie._id
      );
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const services = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: services };
  };

  render() {
    const { length: count } = this.state.services;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0)
      return (
        <div>
          <h2>aucun service dans la base de donnée</h2>
          {user && (
            <ServiceForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
        </div>
      );

    const { totalCount, data: services } = this.getPagedData();
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
          <h3>il ya {totalCount} services dans la base de données</h3>

          {user && (
            <ServiceForm
              formDisplay={this.state.formDisplay}
              toggleForm={this.toggleForm}
            />
          )}
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ServicesTable
            user={user}
            services={services}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></ServicesTable>
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

export default Services;
