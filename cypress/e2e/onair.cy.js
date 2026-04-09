describe('Web app deve estar online', () => {
  it('Deve acessar a página principal',()=>{
    cy.visit('/')
    cy.title().should('equal','Samurai Barbershop by QAninja')  
  })
})