describe('Home', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('Deve exibir cards de contatos', () => {
    cy.get('@vuetify').card().should('have.length.gt', 0)
  })

  it('Deve favoritar um contato', () => {
    cy.get('@vuetify').card().first().trigger('mouseover')
    cy.get('@vuetify').icon('mdi-star').first().click({ force: true })
    cy.get('@vuetify').icon('mdi-star').first().should('have.class', 'text-yellow')
  })
})
