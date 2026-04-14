import { el } from './elements'
import toast from "../../components/toast"; 


class ForgotPassPage {

    constructor(){
        this.toast = toast
    }

    go(){
        cy.visit('/forgot-password')
    }

    from(email){
        cy.get(el.email).clear().type(email)
    }

    submit(){
        cy.get(el.sendButton).click()
    }
}

export default new ForgotPassPage()