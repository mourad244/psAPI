import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";
import axios from "axios";
import { apiUrl } from "../config.json";
import DisplayImage from "./displayImage";
import UploadImage from "./uploadImage";
class Form extends Component {
  state = {
    data: {},
    error: {},
    form: "",
    inputItem: "",
    sendFile: false,
    selectedFile: null,
    image: null,
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

    // console.log(array);
    // console.log(i);
    const data = { ...this.state.data };
    data[array].splice(i, 1);
    console.log(data);
    this.setState({ data });
  };
  addItem = (e, inputItem) => {
    e.preventDefault();
    const errors = { ...this.state.errors };

    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };

    data[e.currentTarget.name].push(inputItem);
    console.log(data);
    this.setState({ data, errors });
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
    console.log(form);
    let data = { ...this.state.data };
    delete data._id;
    for (const item in data) {
      if (Array.isArray(data[item])) {
        // data[item].map((i, index) => console.log(item + `[${index}]`));
        data[item].map((i, index) => fd.append(item + `[${index}]`, i));
      } else {
        fd.append(item, data[item]);
      }
    }
    fd.append("image", this.state.selectedFile, this.state.selectedFile.name);

    this.props.match.params.id
      ? axios.put(apiUrl + `/${form}/${this.props.match.params.id}`, fd)
      : axios.post(apiUrl + `/${form}`, fd);

    this.props.history.push(`/${form}`);
  };

  fileSelectedHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ selectedFile: event.target.files[0] });
      this.setState({ sendFile: true });
      this.setState({ image: URL.createObjectURL(event.target.files[0]) });
      // let img = event.target.files[0];
      // let formData = new FormData();
      // let data = { ...this.state.data };
      // for (const item in data) {
      //   formData.append(item, data[item]);
      // }
      // formData.append("image", img);
      // // data.map((item) => {
      // //
      // // });
      // console.log(formData);
      // this.setState({ formData });
    }
  };
  renderImage(name, label) {
    const { data, errors } = this.state;
    const height = 200;
    return (
      <div>
        <DisplayImage
          name={name}
          images={data[name]}
          label={label}
          height={height}
        />
      </div>
    );
  }
  renderUpload(name, label, type = "file") {
    const { image } = this.state;
    const height = 200;
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

  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
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

  updateInputItem = (e) => {
    this.setState({ inputItem: e.target.value });
  };

  renderList(name, label) {
    const { data, errors, inputItem } = this.state;
    return (
      <div>
        {data[name].map((item, index) => {
          return (
            <div key={index}>
              <Input
                name={name}
                key={name + index}
                value={item}
                label={label + " " + (index + 1)}
                onChange={(e) => this.handleChangeList(e, index)}
                error={errors[name]}
              />
              <button
                onClick={(e) => this.handleDeleteItem(e, name, index)}
                className="btn btn-danger btn-sm"
              >
                delete {label + " " + (index + 1)}
              </button>
            </div>
          );
        })}
        <div>
          <Input
            name={name}
            placeholder={`add ${name}`}
            onChange={this.updateInputItem}
            error={errors[name]}
          />
          <button name={name} onClick={(e) => this.addItem(e, inputItem)}>
            add
          </button>
        </div>
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
