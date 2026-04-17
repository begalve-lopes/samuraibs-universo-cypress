import loginPage from "../support/pages/login";
import dashPage from "../support/pages/dash";

describe("dashboard", function () {
  context("quando o cliente faz agendamento no app mobile", function () {
    const now = new Date();

    const data = {
      client: {
        name: "Nikk Sixx",
        email: "sixx@email.com",
        password: "123456",
        is_provider: false,
      },

      provider: {
        name: "Mick Jagger",
        email: "jagger@email.com",
        password: "123456",
        is_provider: true,
      },
    };

    before(function () {
      cy.postUser(data.provider);
      cy.postUser(data.client);

      cy.apiLogin(data.client);
      cy.get("@apiToken").then((token) => {
        console.log("temos o token: " + token);
      });

      cy.setProviderId(data.provider.email);
      cy.createAppointment();
    });

    it("o mesmo deve ser exibido no dashboard", function () {
      loginPage.go();
      loginPage.form(data.provider);
      loginPage.submit();

      dashPage.calendarShouldBeVisible();

      cy.get("@appointmentDay").then((day) => {
        dashPage.selectDay(day);
      });

      dashPage.appointmentShould(data.client);
    });
  });
});
