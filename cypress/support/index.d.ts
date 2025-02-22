declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to select Vuetify elements
     * @example cy.get('@vuetify').button('Texto do Botão')
     */
    button(label: string): Chainable<JQuery<HTMLElement>>
    textField(label: string): Chainable<JQuery<HTMLElement>>
    table(): Chainable<JQuery<HTMLElement>>
    card(): Chainable<JQuery<HTMLElement>>
    icon(iconName: string): Chainable<JQuery<HTMLElement>>
  }
}
