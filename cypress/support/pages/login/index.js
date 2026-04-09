import { el } from "./elements";
import toast from "../../components/toast";

class LoginPage {

  constructor() {
    this.toast = toast;
  }

  go() {
    cy.visit("/");

    cy.contains(el.title).should("be.visible");
  }

  form(user) {
    cy.get(el.email).type(user.email);
    cy.get(el.password).type(user.password);
  }

  submit() {
    cy.contains(el.buttonLogin).click();
  }
}

export default new LoginPage();
