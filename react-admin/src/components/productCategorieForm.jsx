import React from "react";
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
    images: Joi.array(),
    description: Joi.string().label("description"),
  };

  async populateProducts() {
    try {
      const productCategorieId = this.props.match.params.id;
      if (productCategorieId === "new") return;

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
    this.props.history.push("/productsCategorie");
  };

  render() {
    return (
      <div>
        <h1>Formulaire Product Type</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nom")}
          {this.state.data.images &&
            this.state.data.images.length != 0 &&
            this.renderImage("images", "Image")}
          {this.renderUpload("image", "upload image")}
          {this.renderInput("description", "Description")}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default ProductCategorieForm;
