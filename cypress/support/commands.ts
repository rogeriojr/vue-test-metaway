export { }

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Faz login com as credenciais fornecidas
       * @example cy.login() -> usa credenciais padrão
       * @example cy.login('user', 'pass') -> credenciais customizadas
       */
      login(username?: string, password?: string): Chainable<void>

      /**
       * Faz login como administrador
       * @example cy.loginAdmin()
       */
      loginAdmin(): Chainable<void>

      /**
       * Localiza botão do Quasar pelo label
       * @example cy.qButton('Salvar').click()
       */
      qButton(label: string | RegExp): Chainable<JQuery<HTMLElement>>

      /**
       * Localiza input do Quasar pelo label
       * @example cy.qInput('Nome').type('João')
       */
      qInput(label: string | RegExp): Chainable<JQuery<HTMLInputElement>>

      /**
       * Seleciona tabela do Quasar
       * @example cy.qTable().should('contain', 'Dados')
       */
      qTable(): Chainable<JQuery<HTMLElement>>

      /**
       * Seleciona diálogo do Quasar
       * @example cy.qDialog().within(() => { ... })
       */
      qDialog(): Chainable<JQuery<HTMLElement>>

      /**
       * Seleciona card do Quasar
       * @example cy.qCard().first().click()
       */
      qCard(): Chainable<JQuery<HTMLElement>>

      /**
       * Localiza ícone pelo data-testid
       * @example cy.qIcon('edit').click()
       */
      qIcon(iconName: string): Chainable<JQuery<HTMLElement>>

      /**
       * Seleciona notificação do Quasar
       * @example cy.qNotification().should('contain', 'Sucesso')
       */
      qNotification(): Chainable<JQuery<HTMLElement>>

      /**
       * Navega pelo menu usando o texto do item
       * @example cy.navigateTo('Contatos')
       */
      navigateTo(menuItem: string): Chainable<JQuery<HTMLElement>>

      /**
       * Reseta os dados de teste via API
       * @example cy.resetTestData()
       */
      resetTestData(): Chainable<void>
    }
  }
}

// Implementação dos comandos
Cypress.Commands.add('login', (username = Cypress.env('USERNAME'), password = Cypress.env('PASSWORD')) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.qInput('Usuário').type(username)
    cy.qInput('Senha').type(password)
    cy.qButton('Entrar').click()
    cy.url().should('include', '/')
    cy.get('.q-drawer').should('be.visible')
  })
})

Cypress.Commands.add('loginAdmin', () => {
  cy.login(Cypress.env('ADMIN_USER'), Cypress.env('ADMIN_PASSWORD'))
})

Cypress.Commands.add('qButton', (label) => {
  return cy.contains('button.q-btn', label)
})

Cypress.Commands.add('qInput', (label) => {
  return cy.contains('.q-field__label', label).parent().find('input')
})

Cypress.Commands.add('qTable', () => {
  return cy.get('.q-table')
})

Cypress.Commands.add('qDialog', () => {
  return cy.get('.q-dialog')
})

Cypress.Commands.add('qCard', () => {
  return cy.get('.q-card')
})

Cypress.Commands.add('qIcon', (iconName) => {
  return cy.get(`[data-testid="${iconName}-icon"]`)
})

Cypress.Commands.add('qNotification', () => {
  return cy.get('.q-notification')
})

Cypress.Commands.add('navigateTo', (menuItem) => {
  return cy.contains('.q-item__label', menuItem).click()
})

Cypress.Commands.add('resetTestData', () => {
  cy.request('POST', `${Cypress.env('API_URL')}/test/reset`).then((response) => {
    expect(response.status).to.eq(200)
    Cypress.log({ name: 'resetTestData', message: 'Dados resetados com sucesso' })
  })
})
