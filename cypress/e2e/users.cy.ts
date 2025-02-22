describe('Usuários', () => {
  beforeEach(() => {
    cy.loginAdmin()
    cy.visit('/users')
  })

  it('Deve criar novo usuário', () => {
    cy.get('@vuetify').button('Novo Usuário').click()

    cy.get('.v-dialog').within(() => {
      cy.get('@vuetify').textField('Usuário').type('novousuario')
      cy.get('@vuetify').textField('Nome').type('Novo Usuário Teste')
      cy.get('@vuetify').button('Salvar').click()
    })

    cy.get('@vuetify').table().contains('td', 'novousuario').should('exist')
  })
})
