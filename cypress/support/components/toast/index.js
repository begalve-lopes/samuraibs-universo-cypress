import { el } from "./elements";

class Toast {
  shouldHaveText(expectText) {
    // validação do resultado esperado
    cy.get(el.toast, { timeout: 10000 })
      .should("be.visible")
      .contains("p", expectText);
  }
}

export default new Toast();
