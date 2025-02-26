describe('Users Management', () => {
  beforeEach(() => {
    cy.adminLogin()
    cy.visit('/usuarios')
  })

  it('should create new user', () => {
    cy.get('button').contains('Novo Usuário').click()

    cy.get('input[aria-label="Nome completo"]').type('New User')
    cy.get('input[aria-label="Usuário"]').type('newuser')
    cy.get('input[aria-label="Senha"]').type('Test1234!')
    cy.get('input[aria-label="CPF"]').type('12345678901')

    cy.contains('Salvar').click()
    cy.contains('Usuário criado com sucesso').should('exist')
  })

  it('should validate admin access', () => {
    cy.login('normaluser', 'password')
    cy.visit('/usuarios')
    cy.contains('Acesso não autorizado').should('exist')
  })
})
