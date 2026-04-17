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
  let now = new Date();
  now.setDate(now.getDate() + 3);

  cy.wrap(now.getDate()).as("appointmentDay");

  const date = moment(now).format("YYYY-MM-DD 15:20");

  const payload = {
    provider_id: this.providerId,
    date: date,
  };

  return cy
    .request({
      method: "POST",
      url: "http://localhost:3333/appointments",
      headers: {
        Authorization: "Bearer " + this.apiToken,
      },
      body: payload,
    })
    .then(function (response) {
      expect(response.status).to.eq(200);
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
        console.log(response.body);

        const providerList = response.body;

        providerList.forEach(function (provaider) {
          if (provaider.email === provaiderEmail) {
            cy.wrap(provaider.id).as("providerId");
          }
        });
      });
  });
});

Cypress.Commands.add("apiLogin", function (user) {
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
      return cy.wrap(response.body.token).as("apiToken");
    });
});
