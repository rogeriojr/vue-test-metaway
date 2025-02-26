describe('User Profile', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/meu-cadastro')
  })

  it('should update profile information', () => {
    cy.get('input[aria-label="Nome completo"]').clear().type('Updated Name')
    cy.get('input[aria-label="Telefone"]').clear().type('11988887777')
    cy.contains('Salvar Alterações').click()

    cy.contains('Dados atualizados com sucesso').should('exist')
  })

  it('should change password', () => {
    cy.get('input[aria-label="Senha Atual"]').type('oldpassword')
    cy.get('input[aria-label="Nova Senha"]').type('NewPassword123!')
    cy.contains('Alterar Senha').click()

    cy.contains('Senha alterada com sucesso').should('exist')
  })

  it('should upload profile photo', () => {
    cy.get('input[type="file"]').selectFile('cypress/fixtures/profile.jpg', { force: true })
    cy.contains('Foto atualizada com sucesso').should('exist')
  })
})
