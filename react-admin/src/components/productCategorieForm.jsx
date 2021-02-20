import React from "react";
import { FaPlus } from "react-icons/fa";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getProductCategorie,
  saveProductCategorie,
} from "../services/productCategorieService";
import _ from "lodash";

class ProductCategorieForm extends Form {
  state = {
    data: {
      name: "",
      images: [],
      description: "",
    },
    errors: {},
    form: "productsCategorie",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    images: Joi /* .array() */.label("images")
      .optional(),
    description: Joi.string().label("description").allow(""),
  };

  async populateProducts() {
    try {
      const productCategorieId = this.props.match.params.id;
      if (productCategorieId === "") return;

      const { data: productCategorie } = await getProductCategorie(
        productCategorieId
      );
      this.setState({ data: this.mapToViewModel(productCategorie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateProducts();
  }

  mapToViewModel(productCategorie) {
    return {
      _id: productCategorie._id,
      name: productCategorie.name,
      images: productCategorie.images,
      description: productCategorie.description,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveProductCategorie(this.state.data);
    if (this.props.match) this.props.history.push("/productsCategorie");
    else {
      window.location.reload();
    }
  };

  render() {
    let productCategorieId;
    try {
      productCategorieId = this.props.match.params.id;
    } catch {}
    return (
      <div
        className={
          "card textcenter mt-3 " +
          (this.props.formDisplay || productCategorieId ? "" : "add-item")
        }
      >
        <div
          className="apt-addheading card-header bg-primary text-white"
          onClick={this.props.toggleForm}
        >
          <FaPlus /> Ajouter categorie de produit
        </div>
        <div className="card-body">
          <form id="aptForm" noValidate onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Nom")}
            {this.state.data.images &&
              this.state.data.images.length != 0 &&
              this.renderImage("images", "Image")}
            {this.renderUpload("image", "upload image")}
            {this.renderInput("description", "Description")}
            {this.renderButton("Sauvegarder")}
          </form>
        </div>
      </div>
    );
  }
}

export default ProductCategorieForm;
