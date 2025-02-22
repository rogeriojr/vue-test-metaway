describe('Pessoas Management', () => {
  beforeEach(() => {
    cy.login('admin', '12345678')
    cy.visit('/pessoas')
  })

  it('Should create new pessoa', () => {
    cy.get('[data-cy="new-pessoa-btn"]').click()
    cy.get('[data-cy="pessoa-name"]').type('Nova Pessoa')
    cy.get('[data-cy="pessoa-cpf"]').type('12345678901')
    cy.get('[data-cy="submit-pessoa"]').click()
    cy.contains('Pessoa salva com sucesso').should('be.visible')
  })

  it('Should upload photo', () => {
    cy.get('[data-cy="upload-photo-btn"]').first().click()
    cy.get('input[type=file]').attachFile('example.png')
    cy.get('[data-cy="submit-photo"]').click()
    cy.contains('Foto atualizada').should('be.visible')
  })

  it('Should delete pessoa', () => {
    cy.get('[data-cy="delete-pessoa"]').first().click()
    cy.get('[data-cy="confirm-delete"]').click()
    cy.contains('Pessoa removida').should('be.visible')
  })
})
