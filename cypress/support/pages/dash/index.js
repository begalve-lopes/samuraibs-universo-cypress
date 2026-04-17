import { el } from "./elements";
import header from "../../components/header";

class DashPage {
  constructor() {
    this.header = header;
  }

  calendarShouldBeVisible() {
    cy.get(el.calendar, { timeout: 7000 }).should("be.visible");
  }

  selectDay(day) {
    cy.get(el.boxDay)
      .contains(".DayPicker-Day:not(.DayPicker-Day--outside)", day)
      .click();
  }

  appointmentShould(customer) {
    cy.contains("div", customer.name).should("be.visible");
  }
}

export default new DashPage();
