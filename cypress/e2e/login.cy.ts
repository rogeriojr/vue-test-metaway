describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Deve exibir o formulário de login', () => {
    cy.get('img[alt="Logo Metaway"]').should('be.visible')
    cy.get('@vuetify').button('Entrar').should('be.visible')
  })

  it('Deve mostrar erro com credenciais inválidas', () => {
    cy.get('@vuetify').textField('Usuário').type('usuário inválido')
    cy.get('@vuetify').textField('Senha').type('senha inválida')
    cy.get('@vuetify').button('Entrar').click()

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Login falhou! Verifique suas credenciais.')
    })
  })

  it('Deve fazer login com sucesso e redirecionar para home', () => {
    cy.get('@vuetify').textField('Usuário').type(Cypress.env('USERNAME'))
    cy.get('@vuetify').textField('Senha').type(Cypress.env('PASSWORD'))
    cy.get('@vuetify').button('Entrar').click()

    cy.url().should('include', '/')
    cy.get('.v-navigation-drawer').should('be.visible')
  })
})
