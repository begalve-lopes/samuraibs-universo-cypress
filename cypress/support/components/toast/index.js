import { el } from './elements'

class Toast{

    shouldHaveText(expectText){
        //validação do resultado esperado
        cy.get(el.toast)
            .should('be.visible')
            .should('have.css', 'opacity', '1')
            .find('p')
            .should('have.text', expectText)
    }
}

export default new Toast()