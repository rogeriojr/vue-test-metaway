describe('Contatos', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/contacts')
  })

  it('Deve adicionar novo contato', () => {
    cy.get('@vuetify').button('Novo Contato').click()

    cy.get('.v-dialog').within(() => {
      cy.get('@vuetify').textField('Nome').type('Novo Contato Teste')
      cy.get('@vuetify').textField('Telefone').type('(11) 98765-4321')
      cy.get('@vuetify').button('Salvar').click()
    })

    cy.get('@vuetify').table().contains('td', 'Novo Contato Teste').should('exist')
  })

  it('Deve editar um contato existente', () => {
    cy.get('@vuetify').icon('mdi-pencil').first().click()

    cy.get('.v-dialog').within(() => {
      cy.get('@vuetify').textField('Nome').clear().type('Contato Editado')
      cy.get('@vuetify').button('Salvar').click()
    })

    cy.get('@vuetify').table().contains('td', 'Contato Editado').should('exist')
  })

  it('Deve excluir um contato', () => {
    cy.get('@vuetify').icon('mdi-delete').first().click()
    cy.on('window:confirm', () => true)
    cy.get('@vuetify').table().contains('td', 'Contato Editado').should('not.exist')
  })
})
