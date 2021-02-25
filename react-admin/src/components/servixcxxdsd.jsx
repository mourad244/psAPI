import React, { useState, useEffect } from "react";
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

function ServicesCategorie(props) {
  const [formDisplay, setFormDisplay] = useState(false);
  const [servicesCategorie, setServicesCategorie] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [totalCount, setTotalCount] = useState(0);
  async function getData() {
    const response = await getServicesCategorie();
    setServicesCategorie(response.data);
    console.log("é");
  }

  useEffect(() => {
    getData();
  }, []);

  async function handleDelete(serviceCategorie) {
    const originalServicesCategorie = servicesCategorie;
    const servicesCategorie = originalServicesCategorie.filter(
      (m) => m._id !== serviceCategorie._id
    );
    setServicesCategorie(servicesCategorie);

    try {
      await deleteServiceCategorie(serviceCategorie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("serviceCategorie déja supprimé");
      setServicesCategorie(originalServicesCategorie);
    }
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleSort(sortColumn) {
    setSortColumn(sortColumn);
  }
  function toggleForm() {
    setFormDisplay(!formDisplay);
  }

  const count = servicesCategorie.length;
  const { user } = props;

  if (count === 0)
    return (
      <div>
        <h2>aucune categorie de service dans la base de donnée</h2>
        {user && (
          <ServiceCategorieForm
            formDisplay={formDisplay}
            toggleForm={toggleForm}
          />
        )}
      </div>
    );
  if (servicesCategorie) getPagedData();
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
            formDisplay={formDisplay}
            toggleForm={toggleForm}
          />
        )}
        <SearchBox value={searchQuery} onChange={handleSearch}></SearchBox>
        <ServicesCategorieTable
          servicesCategorie={servicesCategorie}
          sortColumn={sortColumn}
          onDelete={handleDelete}
          onSort={handleSort}
        ></ServicesCategorieTable>
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        ></Pagination>
      </div>
    </div>
  );
}

export default ServicesCategorie;
