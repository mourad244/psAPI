import React from "react";
import { FaPlus } from "react-icons/fa";
import Joi from "joi-browser";
import Form from "../common/form";
import { getProductsType } from "../services/productTypeService";
import { getProduct, saveProduct } from "../services/productService";
import _ from "lodash";

class ProductForm extends Form {
  state = {
    data: {
      type: "",
      name: "",
      description: [],
      avis: [],
      images: [],
    },
    errors: {},
    types: [],
    form: "products",
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Nom"),
    avis: Joi.array().label("avis"),
    images: Joi./* array() */ label("images").optional(),
    description: Joi /* .array() */.label("description"),
    type: Joi.string().required().label("type de produit"),
  };

  async populateTypes() {
    const { data: types } = await getProductsType();
    this.setState({ types });
  }

  async populateProducts() {
    try {
      const productId = this.props.match.params.id;
      if (productId === "") return;

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
      images: product.images,
      description: product.description,
      type: product.type,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveProduct(this.state.data);
    if (this.props.match) this.props.history.push("/products");
    else {
      window.location.reload();
    }
  };

  render() {
    let productId;
    try {
      productId = this.props.match.params.id;
    } catch {}
    return (
      <div
        className={
          "card textcenter mt-3 " +
          (this.props.formDisplay || productId ? "" : "add-item")
        }
      >
        <div
          className="apt-addheading card-header bg-primary text-white"
          onClick={this.props.toggleForm}
        >
          <FaPlus /> Ajouter produit
        </div>
        <div className="card-body">
          <form id="aptForm" noValidate onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Nom")}
            {this.state.data.images.length != 0 &&
              this.renderImage("images", "Image")}
            {this.renderUpload("image", "upload image")}
            {this.renderList("description", "Description")}
            {this.renderInputList("description", "Description")}
            {this.renderSelect("type", "Type de produit", this.state.types)}
            {this.renderButton("Sauvegarder")}
          </form>
        </div>
      </div>
    );
  }
}

export default ProductForm;
