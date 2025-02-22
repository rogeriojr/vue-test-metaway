describe('Home and Contacts Management', () => {
  beforeEach(() => {
    cy.login('admin', '12345678')
    cy.visit('/')
  })

  it('Should display contacts list', () => {
    cy.get('[data-cy="contacts-list"]').should('exist')
    cy.get('[data-cy="contact-card"]').should('have.length.gt', 0)
  })

  it('Should search contacts', () => {
    cy.createContact({
      name: 'Test Search',
      phone: '41999999999',
      email: 'test@search.com'
    })

    cy.get('[data-cy="search-contacts"]').type('Test Search')
    cy.get('[data-cy="contact-card"]').should('contain', 'Test Search')
  })

  it('Should toggle favorite', () => {
    cy.get('[data-cy="favorite-btn"]').first().click()
    cy.get('[data-cy="favorite-badge"]').first().should('exist')
  })

  it('Should delete contact', () => {
    cy.get('[data-cy="delete-contact"]').first().click()
    cy.get('[data-cy="confirm-delete"]').click()
    cy.contains('Contato removido com sucesso').should('be.visible')
  })
})
