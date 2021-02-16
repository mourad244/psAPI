import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getServicesCategorie } from "../services/serviceCategorieService";
import { getService, saveService } from "../services/serviceService";
import _ from "lodash";
import Input from "../common/input";

class ServiceForm extends Form {
  state = {
    data: {
      name: "",
      desc1: "",
      desc2: "",
      caracteristiques: [],
      images: [],
      accessoires: [],
      categorie: "",
    },
    errors: {},
    categories: [],
    form: "services",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    desc1: Joi.string().required().label("Desc1"),
    desc2: Joi.string().required().label("Desc2"),
    caracteristiques: Joi /* .array() */.label("Caracteristiques"),
    images: Joi /* .array() */.label("images")
      .optional(),
    accessoires: Joi /* .array() */.label("accessoires")
      .optional(),
    categorie: Joi.string().required().label("Categorie de service"),
  };

  async populateCategories() {
    const { data: categories } = await getServicesCategorie();

    this.setState({ categories });
  }

  async populateServices() {
    try {
      const serviceId = this.props.match.params.id;
      if (serviceId === "new") return;

      const { data: service } = await getService(serviceId);
      this.setState({ data: this.mapToViewModel(service) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateServices();
    await this.populateCategories();
  }

  mapToViewModel(service) {
    return {
      _id: service._id,
      name: service.name,
      desc1: service.desc1,
      desc2: service.desc2,
      caracteristiques: service.caracteristiques,
      images: service.images,
      accessoires: service.accessoires,
      categorie: service.categorie,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveService(this.state.data);
    this.props.history.push("/services");
  };

  render() {
    return (
      <div>
        <h1>Formulaire Service</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nom")}
          {this.renderInput("desc1", "Desc1")}
          {this.renderInput("desc2", "Desc2")}
          {this.renderList("caracteristiques", "Caractéristiques")}
          {this.state.data.images.length != 0 &&
            this.renderImage("images", "Image")}
          {this.renderUpload("image", "upload image")}
          {this.state.data.accessoires.length != 0 &&
            this.renderImage("accessoires", "Accessoire")}
          {this.renderUpload("accessoire", "upload accessoire")}
          {this.renderSelect(
            "categorie",
            "Categorie de produit",
            this.state.categories
          )}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default ServiceForm;
