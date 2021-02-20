import React from "react";
import { FaPlus } from "react-icons/fa";
import Joi from "joi-browser";
import Form from "../common/form";
import { getServicesCategorie } from "../services/serviceCategorieService";
import { getService, saveService } from "../services/serviceService";
import _ from "lodash";

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
    desc1: Joi.string().label("Desc1").allow(""),
    desc2: Joi.string().label("Desc2").allow(""),
    caracteristiques: Joi /* .array() */.label("Caracteristiques"),
    images: Joi /* .array() */.label("images"),
    accessoires: Joi /* .array() */.label("accessoires"),
    categorie: Joi.string().required().label("Categorie de service"),
  };

  async populateCategories() {
    const { data: categories } = await getServicesCategorie();
    this.setState({ categories });
  }

  async populateServices() {
    try {
      const serviceId = this.props.match.params.id;
      if (serviceId === "") return;

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
    if (this.props.match) this.props.history.push("/services");
    else {
      window.location.reload();
    }
  };

  render() {
    let serviceId;
    try {
      serviceId = this.props.match.params.id;
    } catch {}
    return (
      <div
        className={
          "card textcenter mt-3 " +
          (this.props.formDisplay || serviceId ? "" : "add-item")
        }
      >
        <div
          className="apt-addheading card-header bg-primary text-white"
          onClick={this.props.toggleForm}
        >
          <FaPlus /> Ajouter service
        </div>
        <div className="card-body">
          <form id="aptForm" noValidate onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Nom")}
            {this.renderInput("desc1", "Desc1")}
            {this.renderInput("desc2", "Desc2")}
            {this.renderList("caracteristiques", "Caractéristiques")}
            {this.renderInputList("caracteristiques", "Caractéristiques")}
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
      </div>
    );
  }
}

export default ServiceForm;
