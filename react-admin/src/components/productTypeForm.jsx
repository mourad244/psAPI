import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getProductsCategorie } from "../services/productCategorieService";
import {
  getProductType,
  saveProductType,
} from "../services/productTypeService";
import _ from "lodash";

class ProductTypeForm extends Form {
  state = {
    data: {
      name: "",
      images: [],
      description: "",
      categorie: "",
    },
    errors: {},
    categories: [],
    form: "productsType",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    images: Joi.array(),
    description: Joi.string().label("description"),
    categorie: Joi.string().required().label("categorie de produit"),
  };

  async populateCategories() {
    const { data: categories } = await getProductsCategorie();
    this.setState({ categories });
  }

  async populateProductsType() {
    try {
      const productTypeId = this.props.match.params.id;
      if (productTypeId === "new") return;

      const { data: productType } = await getProductType(productTypeId);
      this.setState({ data: this.mapToViewModel(productType) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateProductsType();
    await this.populateCategories();
  }

  mapToViewModel(productType) {
    return {
      _id: productType._id,
      name: productType.name,
      images: productType.images,
      description: productType.description,
      categorie: productType.categorie,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveProductType(this.state.data);
    this.props.history.push("/productsType");
  };

  render() {
    const { categories } = this.state;
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
          {this.renderSelect("categorie", "Categorie de produit", categories)}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default ProductTypeForm;
