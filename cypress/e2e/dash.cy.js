import dashPage from "../support/pages/dash";

import { constomer, provider } from "../support/factories/dash";

describe("dashboard", function () {
  context("quando o cliente faz agendamento no app mobile", function () {
    const now = new Date();

    before(function () {
      cy.postUser(provider);
      cy.postUser(constomer);

      cy.apiLogin(constomer);
      cy.get("@apiToken").then((token) => {
        console.log("temos o token: " + token);
      });

      cy.setProviderId(provider.email);
      cy.createAppointment();
    });

    it("o mesmo deve ser exibido no dashboard", function () {
      cy.uiLogin(provider);
      //cy.apiLogin(provider,true);

      cy.get("@appointmentDay").then((day) => {
        dashPage.selectDay(day);
      });

      dashPage.calendarShouldBeVisible();
      dashPage.appointmentShould(constomer);
    });
  });
});
