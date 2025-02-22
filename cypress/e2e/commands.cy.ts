declare namespace Cypress {
  interface Chainable {
    login(username?: string, password?: string): Chainable<void>
    loginAdmin(): Chainable<void>
  }
}

Cypress.Commands.add('login', (username = Cypress.env('USERNAME'), password = Cypress.env('PASSWORD')) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('input').eq(0).type(username)
    cy.get('input').eq(1).type(password)
    cy.contains('button', 'Entrar').click()
    cy.url().should('include', '/')
  })
})

Cypress.Commands.add('loginAdmin', () => {
  cy.login(Cypress.env('ADMIN_USER'), Cypress.env('ADMIN_PASSWORD'))
})
