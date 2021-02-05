import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getMilitaire } from "../services/militaireService";
import { getPermission, savePermission } from "../services/permissionService";
import "moment-timezone";

class PermissionForm extends Form {
  state = {
    data: {
      nom: "",
      prenom: "",
      grade: "",
      type: "",
      dateDepart: "",
      dateArrivee: "",
    },
    militaireId: {},
    errors: {},
    types: [{ nom: "detente" }, { nom: "exceptionnelle" }],
  };

  schema = {
    _id: Joi.string(),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    grade: Joi.string().required().label("Grade"),
    type: Joi.string().required().label("Type de permission"),
    dateDepart: Joi.date().iso().required().label("Date de départ"),
    dateArrivee: Joi.date().iso().label("Date de rejoint"),
  };
  async populateMilitaire() {
    try {
      const militaireId = this.props.match.params.id;
      const { data: militaire } = await getMilitaire(militaireId);
      this.setState({
        data: this.mapToViewModel(
          // null,
          militaire.nom,
          militaire.prenom,
          militaire.grade,
          militaire.dateDepart,
          militaire.dateArrivee
        ),
        militaireId: militaireId,
      });
    } catch (ex) {
      try {
        const permissionId = this.props.match.params.id;
        const { data: permission } = await getPermission(permissionId);
        this.setState({
          data: this.mapToViewModel(
            // permission._id,
            permission.nom,
            permission.prenom,
            permission.grade,
            permission.type,
            permission.dateDepart,
            permission.dateArrivee
          ),
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          this.props.history.replace("/not-found");
        }
      }
    }
  }

  async populatePermissions() {
    try {
    } catch (ex) {}
  }
  async componentDidMount() {
    await this.populateMilitaire();
    // await this.popsulatePermissions();
  }

  mapToViewModel(
    // id = null,
    nom,
    prenom,
    grade,
    type,
    dateDepart = "",
    dateArrivee = ""
  ) {
    return {
      // _id: id,
      nom: nom,
      prenom: prenom,
      grade: grade,
      type: type,
      dateDepart: dateDepart,
      dateArrivee: dateArrivee,
    };
  }

  doSubmit = async () => {
    const militaire = this.state.militaireId;

    const { type, dateDepart, dateArrivee } = this.state.data;

    const toSend = { type, dateDepart, dateArrivee, militaire };

    await savePermission(toSend);
    this.props.history.push("/permissions");
  };

  render() {
    const { nom, prenom, grade } = this.state.data;

    return (
      <div>
        <h1>Nouvelle permission</h1>
        <form onSubmit={this.handleSubmit}>
          <div>Nom: {nom}</div>
          <div>Prenom: {prenom}</div>
          <div>Grade: {grade}</div>
          {this.renderSelect("type", "Type Permission", this.state.types)}
          {this.renderInput("dateDepart", "Date Depart", "date")}
          {this.renderInput("dateArrivee", "Date Rejoint", "date")}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default PermissionForm;
