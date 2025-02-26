describe('Home Page', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('should display contact cards', () => {
    cy.get('.contact-card').should('have.length.greaterThan', 0)
  })

  it('should search contacts', () => {
    cy.get('input[aria-label="Pesquisar contatos"]').type('John')
    cy.get('.contact-card').should('have.length.at.least', 1)
  })

  it('should toggle favorites', () => {
    cy.contains('button', 'Mostrar favoritos').click()
    cy.get('.contact-card').each($card => {
      cy.wrap($card).find('.favorite-badge').should('exist')
    })
  })

  it('should open and fill new contact dialog', () => {
    cy.get('button[aria-label="Novo contato"]').click()

    cy.get('input[aria-label="Nome"]').type('Novo Contato')
    cy.get('input[aria-label="CPF"]').type('12345678901')
    cy.get('input[aria-label="Telefone"]').type('11999999999')

    cy.contains('button', 'Salvar').click()
    cy.contains('Contato criado com sucesso').should('exist')
  })
})
