import { el } from "./elements"
import toast from "../../components/toast"; 

class ResetPassPage{

    constructor(){
        this.toast = toast
    }

    go(token){
        cy.visit(`/reset-password?token=${token}`)
    }

    form(password, password_confirmation){
        cy.get(el.password).type(password)
        cy.get(el.password_confirmation).type(password_confirmation)
    }

    submit(){
        cy.get(el.changePassButton).click()
    }
}


export default new ResetPassPage()