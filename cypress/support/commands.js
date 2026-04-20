// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import moment from "moment";
import dashPage from "../support/pages/dash";
import loginPage from "../support/pages/login";

//app action
Cypress.Commands.add("uiLogin", function (user) {
  loginPage.go();
  loginPage.form(user);
  loginPage.submit();

  dashPage.header.userLoggedIn(user.name);
});

Cypress.Commands.add("postUser", (user) => {
  return cy
    .task("deleteUser", user.email)
    .then((resultado) => {
      console.log(resultado);
    })
    .then(() => {
      return cy
        .request({
          method: "POST",
          url: "http://localhost:3333/users",
          body: user,
          failOnStatusCode: false,
        })
        .then((response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property("name", user.name);
            expect(response.body).to.have.property("email", user.email);
            return response;
          }

          if (
            response.status === 400 &&
            response.body &&
            response.body.message === "Email address already used."
          ) {
            return response;
          }

          throw new Error(
            `Failed to create user ${user.email}: ${response.status} - ${response.body?.message}`,
          );
        });
    });
});

Cypress.Commands.add("recoveryPass", function (email) {
  return cy
    .request({
      method: "POST",
      url: "http://localhost:3333/password/forgot",
      body: { email },
    })
    .then(function (response) {
      expect(response.status).to.eq(204);

      return cy.task("findToken", email).then(function (result) {
        return cy.wrap(result.token).as("recoveryToken");
      });
    });
});

Cypress.Commands.add("createAppointment", function () {
  const now = moment().add(4, 'days').toDate(); // Cria uma data 4 dias no futuro

  cy.wrap(now).as("appointmentDate");

  const date = moment(now).format("YYYY-MM-DD 15:20");

  cy.get("@apiToken").then((apiToken) => {
    cy.get("@providerId").then((providerId) => {
      cy.request({
        method: "POST",
        url: "http://localhost:3333/appointments",
        headers: {
          Authorization: "Bearer " + apiToken,
        },
        body: {
          provider_id: providerId,
          date: date,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});

Cypress.Commands.add("setProviderId", function (provaiderEmail) {
  return cy.get("@apiToken").then((token) => {
    return cy
      .request({
        method: "GET",
        url: "http://localhost:3333/providers",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(function (response) {
        expect(response.status).to.eq(200);

        const provider = response.body.find((p) => p.email === provaiderEmail.toLowerCase());

        if (!provider) throw new Error(`Provider com email ${provaiderEmail} não encontrado`);

        cy.wrap(provider.id).as("providerId");
      });
  });
});

Cypress.Commands.add("apiLogin", function (user, setLocalStorage = false) {
  const payload = {
    email: user.email,
    password: user.password,
  };

  return cy
    .request({
      method: "POST",
      url: "http://localhost:3333/sessions",
      body: payload,
    })
    .then(function (response) {
      expect(response.status).to.eq(200);

      if (setLocalStorage) {
        const { token, user } = response.body;
        window.localStorage.setItem("@Samurai:token", token);
        window.localStorage.setItem("@Samurai:user", JSON.stringify(user));
        cy.visit("/dashboard");
      }

      return cy.wrap(response.body.token).as("apiToken");
    });
});
