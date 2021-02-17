import React from "react";
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
    smallDesc: Joi.string().label("Petite Description"),
    largeDesc: Joi /* .array() */.label("Large description"),
    assistance: Joi /* .array() */.label("Assistance"),
    images: Joi.array(),
  };

  async populateServices() {
    try {
      const serviceCategorieId = this.props.match.params.id;
      if (serviceCategorieId === "new") return;

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
    await this.populateServices();
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
    this.props.history.push("/servicesCategorie");
  };

  render() {
    return (
      <div>
        <h1>Formulaire categorie de service </h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nom")}
          {this.renderInput("smallDesc", "Petite Description")}
          {this.renderList("largeDesc", "Large Description")}
          {console.log(this.state.data.assistance)}
          {this.renderList("assistance", "Assistance")}
          {this.state.data.images &&
            this.state.data.images.length != 0 &&
            this.renderImage("images", "Image")}
          {this.renderUpload("image", "upload image")}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default ServiceCategorieForm;
