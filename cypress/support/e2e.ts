import './commands'

// Configuração global
beforeEach(() => {
  // Mock de APIs
  cy.intercept('POST', '/api/login', { fixture: 'users.json' }).as('login')
  cy.intercept('GET', '/api/contatos', { fixture: 'contacts.json' }).as('getContacts')
  cy.intercept('GET', '/api/pessoas', { fixture: 'persons.json' }).as('getPersons')

  // Mock de upload de foto
  cy.intercept('POST', '/api/upload', {
    statusCode: 200,
    body: {
      url: '/uploads/profile.png'
    }
  }).as('uploadPhoto')
})
