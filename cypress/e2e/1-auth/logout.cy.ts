describe('Logout', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
  })

  it('should logout successfully', () => {
    // Abre o menu lateral
    cy.get('button[aria-label="Menu"]').click()

    // Clica no botão de logout
    cy.contains('Sair').click()

    // Verifica se foi redirecionado para login
    cy.url().should('include', '/login')

    // Tenta acessar rota protegida
    cy.visit('/')
    cy.url().should('include', '/login')

    // Verifica limpeza do estado
    cy.window().its('localStorage').invoke('getItem', 'auth').should('be.null')
  })

  it('should persist session when not logging out', () => {
    cy.reload()
    cy.url().should('include', '/')
    cy.window().its('localStorage').invoke('getItem', 'auth').should('exist')
  })
})
