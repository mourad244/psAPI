import React, { Component } from "react";
import { toast } from "react-toastify";
import SearchBox from "../common/searchBox";
import PermissionsTable from "./permissionsTable";
import Pagination from "../common/pagination";
import {
  getPermissions,
  deletePermission,
} from "../services/permissionService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Permissions extends Component {
  state = {
    militaires: [],
    permissions: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    sortColumn: { path: "dateDepart", order: "desc" },
    militaire: {},
  };

  async componentDidMount() {
    const { data: permissions } = await getPermissions();

    this.setState({ permissions });
  }
  // handleAdd = (permission) => {
  //   const militaire = permission.militaire;
  //   this.setState({ militaire });
  //   console.log(militaire);
  // };

  handleModify = async (permission) => {};

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  handleDelete = async (permission) => {
    const originalPermissions = this.state.permissions;
    const permissions = originalPermissions.filter(
      (m) => m._id !== permission._id
    );
    this.setState({ permissions });

    try {
      await deletePermission(permission._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("permission déja supprimé");
      this.setState({ permissions: originalPermissions });
    }
  };
  handleSort = (sortColumn) => {};

  handlePermissionSelect = (permission) => {};

  handleSearch = (query) =>
    this.setState({
      searchQuery: query,
      currentPage: 1,
    });
  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      permissions: allPermissions,
    } = this.state;
    let filtered = allPermissions;
    if (searchQuery)
      filtered = allPermissions.filter((m) =>
        m.militaire.nom.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const permissions = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, data: permissions };
  };

  render() {
    const { pageSize, currentPage, searchQuery, sortColumn } = this.state;

    const { totalCount, data: permissions } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <PermissionsTable
            permissions={permissions}
            sortColumn={sortColumn}
            // onAdd={this.handleAdd}
            onDelete={this.handleDelete}
            onModify={this.handleModify}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Permissions;
