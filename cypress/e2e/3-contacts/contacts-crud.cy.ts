describe('Contacts CRUD', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/contatos')
  })

  it('should create new contact', () => {
    cy.get('button').contains('Novo Contato').click()

    cy.get('input[aria-label="Nome"]').type('John Doe')
    cy.get('input[aria-label="CPF"]').type('12345678901')
    cy.get('input[aria-label="Telefone"]').type('11999999999')
    cy.get('input[aria-label="Email"]').type('john@test.com')

    cy.contains('Salvar').click()
    cy.contains('Contato criado com sucesso').should('exist')
  })

  it('should edit contact', () => {
    cy.get('table tbody tr').first().find('button[aria-label="Editar"]').click()

    cy.get('input[aria-label="Nome"]').clear().type('Updated Name')
    cy.contains('Salvar').click()

    cy.contains('Contato atualizado com sucesso').should('exist')
  })

  it('should delete contact', () => {
    cy.get('table tbody tr').first().find('button[aria-label="Excluir"]').click()
    cy.contains('Confirmar exclusão').should('be.visible')
    cy.contains('button', 'Confirmar').click()

    cy.contains('Contato excluído com sucesso').should('exist')
  })
})
