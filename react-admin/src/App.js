import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./common/navBar";
import ServicesCategorie from "./components/servicesCategorie";
import ServiceCategorieForm from "./components/serviceCategorieForm";
import Products from "./components/products";
import ProductForm from "./components/productForm";
import ProductsType from "./components/productsType";
import ProductTypeForm from "./components/productTypeForm";
import ProductsCategorie from "./components/productsCategorie";
import ProductCategorieForm from "./components/productCategorieForm";
import NotFound from "./components/notFound";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import auth from "./services/authService";
import ProtectedRoute from "./common/protectedRoute";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute
              path="/servicescategorie/:id"
              component={ServiceCategorieForm}
            />
            <Route
              path="/servicescategorie"
              render={(props) => (
                <ServicesCategorie {...props} user={this.state.user} />
              )}
            />
            <ProtectedRoute
              path="/productsCategorie/:id"
              component={ProductCategorieForm}
            />
            <Route
              path="/productscategorie"
              render={(props) => (
                <ProductsCategorie {...props} user={this.state.user} />
              )}
            />
            <ProtectedRoute
              path="/productstype/:id"
              component={ProductTypeForm}
            />
            <Route
              path="/productstype"
              render={(props) => (
                <ProductsType {...props} user={this.state.user} />
              )}
            />

            <ProtectedRoute path="/products/:id" component={ProductForm} />
            <Route
              path="/products"
              render={(props) => <Products {...props} user={this.state.user} />}
            />

            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/products" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
