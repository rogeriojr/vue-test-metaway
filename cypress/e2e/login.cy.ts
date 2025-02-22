describe('Login Tests', () => {
  it('Should login successfully with admin credentials', () => {
    cy.login('admin', '12345678')
    cy.contains('Bem-vindo').should('be.visible')
  })

  it('Should show error with invalid credentials', () => {
    cy.visit('/login')
    cy.get('[data-cy="username"]').type('wronguser')
    cy.get('[data-cy="password"]').type('wrongpass')
    cy.get('[data-cy="submit-login"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
  })

  it('Should redirect authenticated users away from login', () => {
    cy.login('admin', '12345678')
    cy.visit('/login')
    cy.url().should('not.contain', '/login')
  })
})
