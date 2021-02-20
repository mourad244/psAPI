import React from "react";
import { FaPlus } from "react-icons/fa";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getServiceCategorie,
  saveServiceCategorie,
} from "../services/serviceCategorieService";
import _ from "lodash";

class ServiceCategorieForm extends Form {
  state = {
    data: {
      name: "",
      smallDesc: "",
      largeDesc: [],
      assistance: [],
      images: [],
    },
    errors: {},
    form: "servicesCategorie",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    smallDesc: Joi.string().label("Petite Description").allow(""),
    largeDesc: Joi /* .array() */.label("Large description"),
    assistance: Joi /* .array() */.label("Assistance"),
    images: Joi.array(),
  };

  async populateServicesCategorie() {
    try {
      const serviceCategorieId = this.props.match.params.id;
      if (serviceCategorieId === "") return;

      const { data: serviceCategorie } = await getServiceCategorie(
        serviceCategorieId
      );
      this.setState({ data: this.mapToViewModel(serviceCategorie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateServicesCategorie();
  }

  mapToViewModel(serviceCategorie) {
    return {
      _id: serviceCategorie._id,
      name: serviceCategorie.name,
      smallDesc: serviceCategorie.smallDesc,
      largeDesc: serviceCategorie.largeDesc,
      assistance: serviceCategorie.assistance,
      images: serviceCategorie.images,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveServiceCategorie(this.state.data);
    if (this.props.match) this.props.history.push("/servicesCategorie");
    else {
      window.location.reload();
    }
  };

  render() {
    let serviceCategorieId;
    try {
      serviceCategorieId = this.props.match.params.id;
    } catch {}
    return (
      <div
        className={
          "card textcenter mt-3 " +
          (this.props.formDisplay || serviceCategorieId ? "" : "add-item")
        }
      >
        <div
          className="apt-addheading card-header bg-primary text-white"
          onClick={this.props.toggleForm}
        >
          <FaPlus /> Ajouter categorie de service
        </div>
        <div className="card-body">
          <form id="aptForm" noValidate onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Nom")}
            {this.renderInput("smallDesc", "Petite Description")}
            {this.renderList("largeDesc", "Large Description")}
            {this.renderInputList("largeDesc", "Large Description")}
            {this.renderList("assistance", "Assistance")}
            {this.renderInputList("assistance", "Assistance")}

            {this.state.data.images &&
              this.state.data.images.length != 0 &&
              this.renderImage("images", "Images")}
            {this.renderUpload("image", "upload image")}
            {this.renderButton("Ajouter")}
          </form>
        </div>
      </div>
    );
  }
}

export default ServiceCategorieForm;
