describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form correctly', () => {
    cy.get('img[alt="Logo Metaway"]').should('be.visible')
    cy.get('input[aria-label="Usuário"]').should('exist')
    cy.get('input[aria-label="Senha"]').should('exist')
    cy.contains('Lembrar credenciais').should('exist')
  })

  it('should validate form fields', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('Campo obrigatório').should('have.length', 2)

    cy.get('input[aria-label="Senha"]').type('short')
    cy.contains('Mínimo 8 caracteres')
  })

  it('should show error for invalid credentials', () => {
    cy.get('input[aria-label="Usuário"]').type('invaliduser')
    cy.get('input[aria-label="Senha"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
  })

  it('should login successfully with remember me', () => {
    cy.get('input[aria-label="Usuário"]').type('testuser')
    cy.get('input[aria-label="Senha"]').type('Test1234!')
    cy.get('input[aria-label="Lembrar credenciais"]').check()
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/')
    cy.window().its('localStorage').invoke('getItem', 'auth').should('exist')
  })
})
