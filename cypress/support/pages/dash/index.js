import { el } from "./elements";
import header from "../../components/header";
import moment from "moment";

class DashPage {
  constructor() {
    this.header = header;
  }

  calendarShouldBeVisible() {
    cy.get(el.calendar, { timeout: 7000 }).should("be.visible");
  }

  // Helper function to get month name in Portuguese
  getMonthName(monthIndex) {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames[monthIndex];
  }

  // Helper function to get month index from Portuguese name
  getMonthIndexFromName(monthName) {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return monthNames.indexOf(monthName);
  }

  selectDay(appointmentDate) {
    const targetDate = moment(appointmentDate);
    const targetMonthIndex = targetDate.month();
    const targetYear = targetDate.year();

    // Definimos o intercept antes de começar a navegação ou o clique
    // Usamos o padrão de busca mais flexível para evitar problemas com portas ou parâmetros
    cy.intercept("GET", /.*\/appointments\/me.*/).as("getAppointmentsForDay");

    const navigateToMonth = () => {
      return cy.get(el.monthYearName).invoke('text').then((monthYearText) => {
        // Regex para extrair o mês e o ano ignorando preposições como "de"
        const parts = monthYearText.match(/(\w+)\s+(?:de\s+)?(\d{4})/);
        const currentMonthIndex = this.getMonthIndexFromName(parts[1]);
        const currentYear = parseInt(parts[2]);

        if (currentMonthIndex === -1) {
          throw new Error(`Could not parse month name: ${parts[1]}`);
        }

        if (currentMonthIndex === targetMonthIndex && currentYear === targetYear) {
          cy.log(`Calendar is showing the target month: ${monthYearText}`);
        } else if (
          currentYear < targetYear ||
          (currentYear === targetYear && currentMonthIndex < targetMonthIndex)
        ) {
          cy.get(el.nextMonthButton).should('be.visible').click();
          return navigateToMonth();
        }
      }
    );
    };

    // Retornamos a navegação para garantir que o Cypress aguarde o fim da recursão
    navigateToMonth().then(() => {
      const dayNumber = appointmentDate.getDate();
      // Regex mais flexível para lidar com possíveis espaços no HTML do calendário
      const targetRegex = new RegExp(`^\\s*${dayNumber}\\s*$`);
  
      cy.get(el.calendar)
        .scrollIntoView()
        .contains(el.boxDay, targetRegex)
        .as("selectedDayElement")
        .click();
  
      // Aguardamos a requisição com um timeout generoso
      cy.wait("@getAppointmentsForDay", { timeout: 10000 });
  
      cy.get("@selectedDayElement").should(
        "have.class",
        "DayPicker-Day--selected",
        { timeout: 7000 },
      );
    });
  }

  appointmentShould(customer) {
    // Removemos a restrição de "div" para encontrar o texto em qualquer elemento da lista
    cy.contains(customer.name, { timeout: 7000 }).should("be.visible");
  }
}

export default new DashPage();
