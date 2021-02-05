import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getFonctions } from "../services/fonctionService";
import {
  getMilitaire,
  getMilitaires,
  saveMilitaire,
} from "../services/militaireService";
import { savePermission } from "../services/permissionService";
import _ from "lodash";

class MilitaireForm extends Form {
  state = {
    data: {
      nom: "",
      prenom: "",
      grade: "",
      mle: "",
      uniteOrigine: "",
      fonction: "",
    },
    fonctions: [],
    errors: {},
    grades: [
      { nom: "2°cl" },
      { nom: "1°cl" },
      { nom: "caporal" },
      { nom: "c/c" },
      { nom: "sgt" },
      { nom: "s/c" },
      { nom: "adjt" },
      { nom: "a/c" },
    ],
  };

  schema = {
    _id: Joi.string(),
    nom: Joi.string().required().label("Nom"),
    prenom: Joi.string().required().label("Prenom"),
    grade: Joi.string().required().label("Grade"),
    mle: Joi.string().required().label("Matricule"),
    uniteOrigine: Joi.string().required().label("Unité origine"),
    fonction: Joi.string().required().label("Fonction"),
  };

  async populateFonctions() {
    const { data: fonctions } = await getFonctions();

    this.setState({ fonctions });
  }

  async populateMilitaires() {
    try {
      const militaireId = this.props.match.params.id;
      if (militaireId === "new") return;

      const { data: militaire } = await getMilitaire(militaireId);
      this.setState({ data: this.mapToViewModel(militaire) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateMilitaires();
    await this.populateFonctions();
  }

  mapToViewModel(militaire) {
    return {
      _id: militaire._id,
      nom: militaire.nom,
      prenom: militaire.prenom,
      grade: militaire.grade,
      mle: militaire.mle,
      uniteOrigine: militaire.uniteOrigine,
      fonction: militaire.fonction,
    };
  }
  doSubmit = async () => {
    // call the server
    await saveMilitaire(this.state.data);
    // ajouter une permission par default au nouveau militaire
    const militaire = _.orderBy((await getMilitaires()).data, "_id", "desc");
    const militaireId = {
      militaire: militaire[0]._id,
    };

    await savePermission(militaireId);
    // console.log(this.state.data);
    this.props.history.push("/militaires");
  };

  render() {
    return (
      <div>
        <h1>Formulaire Militaire</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("nom", "Nom")}
          {this.renderInput("prenom", "Prenom")}
          {this.renderSelect("grade", "Grade", this.state.grades)}
          {this.renderInput("mle", "Matricule")}
          {this.renderInput("uniteOrigine", "Unité origine")}
          {this.renderSelect("fonction", "Fonction", this.state.fonctions)}
          {this.renderButton("Sauvegarder")}
        </form>
      </div>
    );
  }
}

export default MilitaireForm;
