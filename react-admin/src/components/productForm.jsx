import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getTypes } from "../services/typeService";
import { getProduct, saveProduct } from "../services/productService";
import _ from "lodash";
import Input from "../common/input";

class ProductForm extends Form {
  state = {
    data: {
      type: "",
      name: "",
      description: [],
      avis: [],
      image: "",
    },
    errors: {},
    types: [],
    formData: "",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    avis: Joi.array().label("avis"),
    image: Joi.string(),
    description: Joi /* .array() */.label("description"),
    type: Joi.string().required().label("type de produit"),
  };

  async populateTypes() {
    const { data: types } = await getTypes();

    this.setState({ types });
  }

  async populateProducts() {
    try {
      const productId = this.props.match.params.id;
      if (productId === "new") return;

      const { data: product } = await getProduct(productId);
      this.setState({ data: this.mapToViewModel(product) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateProducts();
    await this.populateTypes();
  }

  mapToViewModel(product) {
    return {
      _id: product._id,
      name: product.name,
      avis: product.avis,
      description: product.description,
      type: product.type,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveProduct(this.state.data);
    this.props.history.push("/products");
  };

  render() {
    return (
      <div>
        <h1>Formulaire Product</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Nom")}
          {this.renderImage("image", "Image")}
          {this.renderList("description", "Description")}
          {this.renderSelect("type", "Type de produit", this.state.types)}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default ProductForm;
