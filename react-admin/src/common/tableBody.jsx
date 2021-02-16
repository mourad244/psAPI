import React, { Component } from "react";
import _ from "lodash";
import DisplayImage from "./displayImage";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.date) return column.date(item);
    if (column.content) return column.content(item);
    console.log(item);
    if (
      column.path == "images" &&
      Array.isArray(item[column.path]) &&
      item[column.path].length
    ) {
      return (
        <DisplayImage
          name={column.path}
          label={column.label}
          images={item[column.path]}
          height="40"
        />
      );
    }
    if (
      column.path == "accessoires" &&
      Array.isArray(item[column.path]) &&
      item[column.path].length
    ) {
      return (
        <DisplayImage
          name={column.path}
          label={column.label}
          images={item[column.path]}
          height="40"
        />
      );
    }
    return _.get(item, column.path);
  };

  createKey = (item, column) => {
    return item._id + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {columns.map((column) => (
              <td key={this.createKey(item, column)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
