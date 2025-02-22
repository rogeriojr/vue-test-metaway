declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): void
    logout(): void
    createContact(contactData: any): void
    createUser(userData: any): void
  }
}

Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('[data-cy="username"]').type(username)
    cy.get('[data-cy="password"]').type(password)
    cy.get('[data-cy="submit-login"]').click()
    cy.url().should('contain', '/')
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]').click()
  cy.url().should('contain', '/login')
})

Cypress.Commands.add('createContact', (contactData) => {
  cy.get('[data-cy="new-contact-btn"]').click()
  cy.get('[data-cy="contact-name"]').type(contactData.name)
  cy.get('[data-cy="contact-phone"]').type(contactData.phone)
  cy.get('[data-cy="contact-email"]').type(contactData.email)
  cy.get('[data-cy="submit-contact"]').click()
  cy.contains('Contato salvo com sucesso').should('be.visible')
})

Cypress.Commands.add('createUser', (userData) => {
  cy.get('[data-cy="new-user-btn"]').click()
  cy.get('[data-cy="user-name"]').type(userData.name)
  cy.get('[data-cy="user-username"]').type(userData.username)
  cy.get('[data-cy="user-password"]').type(userData.password)
  cy.get('[data-cy="submit-user"]').click()
  cy.contains('Usuário salvo com sucesso').should('be.visible')
})
