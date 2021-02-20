import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group form-row">
      <label className="col-md-2 col-form-label text-md" htmlFor={name}>
        {label}
      </label>
      <div className="col-md-10">
        <input {...rest} name={name} id={name} className="form-control" />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default Input;
