import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import axios from "axios";
import DisplayImage from "./displayImage";
import UploadImage from "./uploadImage";
class Form extends Component {
  state = {
    data: {},
    error: {},
    form: "",
    inputItem: "",
    sendFile: false,
    fileObj: [],
    fileArray: [],

    // image: null, // when uploaded
    // selectedimage: null,
  };
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleChangeList = ({ currentTarget: input }, index) => {
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };

    data[input.name][index] = input.value;
    this.setState({ data, errors });
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleDeleteItem = (e, array, i) => {
    e.preventDefault();

    const data = { ...this.state.data };
    data[array].splice(i, 1);
    this.setState({ data });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    const sendFile = this.state.sendFile;
    if (sendFile) {
      return this.fileUploadHandler();
    }
    if (errors) return;
    this.doSubmit();
  };

  fileUploadHandler = () => {
    const fd = new FormData();
    const form = this.state.form;

    let data = { ...this.state.data };
    delete data._id;
    for (const item in data) {
      if (Array.isArray(data[item])) {
        data[item].map((i, index) => fd.append(item + `[${index}]`, i));
      } else {
        fd.append(item, data[item]);
      }
    }
    for (const item in this.state) {
      if (item.includes("selected")) {
        let filename = item.replace("selected", "");
        for (let i = 0; i < this.state[item][0].length; i++)
          fd.append(
            filename,
            this.state[item][0][i],
            this.state[item][0][i].name
          );
      }
    }
    this.props.match != undefined &&
    this.props.match.params.id /* && this.props.match.params.id != "new" */
      ? axios.put(`/${form}/${this.props.match.params.id}`, fd)
      : axios.post(`/${form}`, fd);
    if (this.props.match) this.props.history.push(`/${form}`);
    else {
      window.location.reload();
    }
  };

  fileSelectedHandler = (event) => {
    let fileObj = [];
    let fileArray = [];
    if (event.target.files && event.target.files[0]) {
      fileObj.push(event.target.files);
      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]));
      }
      // for (let item in fileObj[0]) {
      //   console.log(fileObj[0][item]);
      //   // fileArray.push(URL.createObjectURL(fileObj[0][item]));
      // }
      this.setState({
        ["selected" + event.target.name]: fileObj,
      });
      this.setState({
        [event.target.name]: fileArray,
      });
      this.setState({ sendFile: true });
    }
  };

  renderUpload(name, label, type = "file") {
    const height = 200;
    const image = this.state[name];

    return (
      <div>
        <UploadImage
          name={name}
          image={image}
          height={height}
          type={type}
          label={label}
          onChange={this.fileSelectedHandler}
        />
      </div>
    );
  }

  renderImage(name, label) {
    const { data, errors } = this.state;
    const height = 200;
    return (
      <div className="form-group form-row">
        <label
          className="col-md-2 col-form-label text-md  align-self-center"
          htmlFor={name}
        >
          {label}
        </label>
        <DisplayImage
          name={name}
          images={data[name]}
          label={label}
          height={height}
        />
      </div>
    );
  }

  renderButton(label) {
    return (
      <div className="form-group form-row mb-0">
        <div className="offset-md-2 col-md-10">
          <button
            disabled={this.validate()}
            className="btn btn-primary d-block ml-auto"
          >
            {label}
          </button>
        </div>
      </div>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      ></Select>
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  addItem = (e, inputItem) => {
    e.preventDefault();
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };

    data[e.currentTarget.name].push(inputItem);
    this.setState({ data, errors });
    this.setState({ [e.target.name]: "" });
  };

  updateInputItem = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderInputList(name, label, type = "text") {
    const inputItem = this.state[name];
    return (
      <div>
        <button
          className="col-md-1  btn-sm  pull-right"
          name={name}
          onClick={(e) => this.addItem(e, inputItem)}
        >
          +
        </button>
        <Input
          key={name}
          value={inputItem || ""}
          name={name}
          type={type}
          label={label}
          placeholder={`add ${name}`}
          onChange={this.updateInputItem}
          // error={errors[name]}
        />
      </div>
    );
  }

  renderList(name, label) {
    const { data, errors /* , inputItem  */ } = this.state;

    return (
      <div>
        <div>
          {data[name].map((item, index) => {
            return (
              <div key={index}>
                <button
                  onClick={(e) => this.handleDeleteItem(e, name, index)}
                  className=" col-md-1 btn btn-danger btn-sm pull-right"
                >
                  -
                </button>
                <Input
                  name={name}
                  key={name + index}
                  value={item}
                  label={label + " " + (index + 1)}
                  onChange={(e) => this.handleChangeList(e, index)}
                  error={errors[name]}
                />
              </div>
            );
          })}
        </div>
        {/* <div>
          <button
            className="col-md-1  btn-sm  pull-right"
            name={name}
            onClick={(e) => this.addItem(e, inputItem)}
          >
            +
          </button>
          <Input
            name={name}
            label={label}
            placeholder={`add ${name}`}
            onChange={this.updateInputItem}
            error={errors[name]}
          />
        </div> */}
      </div>
    );
  }

  // renderDate(name, label) {
  //   const { data, error } = this.state;
  //   return (
  //     <div className="form-group">
  //       <label htmlFor={name}>{label}</label>
  //       <input name={name} id={name} className="form-control" />
  //       {error && <div className="alert alert-danger">{error}</div>}
  //     </div>
  //   );
  // }
}

export default Form;
