class Toast {
    shouldHaveText(expectedText){
        cy.get(".toast").find('p').should("have.text", expectedText);
    }
}

export default new Toast();