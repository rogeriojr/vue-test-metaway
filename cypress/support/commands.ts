declare namespace Cypress {
  interface Chainable {
    login(username?: string, password?: string): Chainable<void>
    adminLogin(): Chainable<void>
  }
}

Cypress.Commands.add('login', (username = 'testuser', password = 'Test1234!') => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('input[aria-label="Usuário"]').type(username)
    cy.get('input[aria-label="Senha"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/')
  })
})

Cypress.Commands.add('adminLogin', () => {
  cy.login('admin', '12345678')
})
