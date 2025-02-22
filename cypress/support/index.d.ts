import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      // Autenticação
      login(username?: string, password?: string): Chainable<void>
      loginAdmin(): Chainable<void>

      // Componentes Quasar
      qButton(label: string | RegExp): Chainable<JQuery<HTMLElement>>
      qInput(label: string | RegExp): Chainable<JQuery<HTMLElement>>
      qTable(): Chainable<JQuery<HTMLElement>>
      qDialog(): Chainable<JQuery<HTMLElement>>
      qCard(): Chainable<JQuery<HTMLElement>>
      qIcon(iconName: string): Chainable<JQuery<HTMLElement>>
      qNotification(): Chainable<JQuery<HTMLElement>>
    }
  }
}
