import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import MilitairesTable from "./militairesTable";
import ListGroup from "../common/listGroup";
import Pagination from "../common/pagination";
import { getMilitaires, deleteMilitaire } from "../services/militaireService";
import { getFonctions } from "../services/fonctionService";
import { paginate } from "../utils/paginate";
import SearchBox from "../common/searchBox";
import _ from "lodash";

class Militaires extends Component {
  state = {
    militaires: [],
    fonctions: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedFonction: null,
    sortColumn: { path: "nom", order: "asc" },
  };
  async componentDidMount() {
    const { data } = await getFonctions();
    const fonctions = [{ _id: "", nom: "Tous les fonctions" }, ...data];

    const { data: militaires } = await getMilitaires();
    this.setState({ militaires, fonctions });
  }

  handleDelete = async (militaire) => {
    const originalMilitaires = this.state.militaires;
    const militaires = originalMilitaires.filter(
      (m) => m._id !== militaire._id
    );
    this.setState({ militaires });

    try {
      await deleteMilitaire(militaire._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("militaire déja supprimé");
      this.setState({ militaires: originalMilitaires });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleFonctionSelect = (fonction) => {
    this.setState({
      selectedFonction: fonction,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (query) =>
    this.setState({
      searchQuery: query,
      selectedFonction: null,
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
      selectedFonction,
      searchQuery,
      militaires: allMilitaires,
    } = this.state;

    let filtered = allMilitaires;
    if (searchQuery)
      filtered = allMilitaires.filter((m) =>
        m.nom.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedFonction && selectedFonction._id) {
      filtered = allMilitaires.filter(
        (m) => m.fonction._id === selectedFonction._id
      );
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const militaires = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: militaires };
  };

  render() {
    const { length: count } = this.state.militaires;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>aucun militaire dans la base de donnée</p>;

    const { totalCount, data: militaires } = this.getPagedData();
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.fonctions}
            selectedItem={this.state.selectedFonction}
            onItemSelect={this.handleFonctionSelect}
          ></ListGroup>
        </div>
        <div className="col">
          <Link
            to={"/militaires/new"}
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
          >
            Nouveau Militaire
          </Link>
          <p>il ya {totalCount} militaires dans la base de données</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>
          <MilitairesTable
            militaires={militaires}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          ></MilitairesTable>
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

export default Militaires;
