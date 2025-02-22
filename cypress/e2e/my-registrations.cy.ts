describe('Meu Cadastro', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/my-registrations')
  })

  it('Deve atualizar informações do usuário', () => {
    cy.get('@vuetify').textField('Nome completo').clear().type('Novo Nome Teste')
    cy.get('@vuetify').button('Salvar Alterações').click()

    cy.get('@vuetify').textField('Nome completo').should('have.value', 'Novo Nome Teste')
  })

  it('Deve alterar a senha', () => {
    cy.get('@vuetify').textField('Senha Atual').type(Cypress.env('PASSWORD'))
    cy.get('@vuetify').textField('Nova Senha').type('novaSenha123')
    cy.get('@vuetify').button('Alterar Senha').click()

    cy.contains('.v-alert', 'Senha alterada com sucesso').should('exist')
  })
})
