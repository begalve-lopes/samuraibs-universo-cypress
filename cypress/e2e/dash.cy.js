import dashPage from "../support/pages/dash";

import { constomer, provider } from "../support/factories/dash";

describe("dashboard", function () {
  context("quando o cliente faz agendamento no app mobile", function () {
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

      dashPage.calendarShouldBeVisible();

      cy.get("@appointmentDate").then((date) => {
        dashPage.selectDay(date);
      });

      dashPage.appointmentShould(constomer);
    });
  });
});
