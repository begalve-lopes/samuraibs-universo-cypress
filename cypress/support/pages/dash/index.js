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
    let today = new Date()
    let lastDayOffMonth = new Date(today.getFullYear(),today.getMonth() + 1, 0)

    if(today.getDate === lastDayOffMonth.getDate){
      cy.get(el.nextMonthButton).should('be.visible').click()
    }else{

    }

    const target = new RegExp(`^${day}$`)
    cy.contains(el.boxDay, target)
      .click({ force: true });
  }

  appointmentShould(customer) {
    cy.contains("div", customer.name).should("be.visible");
  }
}

export default new DashPage();
