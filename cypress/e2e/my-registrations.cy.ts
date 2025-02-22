describe('Meu Cadastro Tests', () => {
  beforeEach(() => {
    cy.login('admin', '12345678')
    cy.visit('/meu-cadastro')
  })

  it('Should update profile', () => {
    cy.get('[data-cy="user-name"]').clear().type('Novo Nome')
    cy.get('[data-cy="submit-profile"]').click()
    cy.contains('Dados atualizados').should('be.visible')
  })

  it('Should change password', () => {
    cy.get('[data-cy="current-password"]').type('12345678')
    cy.get('[data-cy="new-password"]').type('NovaSenha123')
    cy.get('[data-cy="confirm-password"]').type('NovaSenha123')
    cy.get('[data-cy="submit-password"]').click()
    cy.contains('Senha alterada').should('be.visible')
  })
})
