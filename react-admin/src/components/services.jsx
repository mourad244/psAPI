import React, { Component } from "react";

import { getServices, deleteService } from "../services/serviceService";
import { getServicesCategorie } from "../services/serviceCategorieService";

import Pagination from "../common/pagination";
import ListGroup from "../common/listGroup";
import ServicesTable from "./servicesTable";

import SearchBox from "../common/searchBox";

import { paginate } from "../utils/paginate";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import _ from "lodash";

class Services extends Component {
  state = {
    services: [],
    categories: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedCategorie: null,
    sortColumn: { path: "name", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getServicesCategorie();
    const categories = [{ _id: "", name: "Tous les categories" }, ...data];

    const { data: services } = await getServices();
    // services.forEach((service) => {
    //   delete service.avis;
    // });
    // console.log(services);
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
        (m) => m.type._id === selectedCategorie._id
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
    <div>hello world</div>;
    if (count === 0)
      return (
        <div>
          {user && (
            <Link
              to={"/services/new"}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              Nouveau Service
            </Link>
          )}
          <p>aucun service dans la base de donnée</p>
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
          {user && (
            <Link
              to={"/services/new"}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              Nouveau Service
            </Link>
          )}

          <p>il ya {totalCount} services dans la base de données</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <ServicesTable
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
