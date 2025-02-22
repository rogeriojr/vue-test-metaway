import './component'

declare global {
  namespace Cypress {
    interface Chainable {
      attachFile(value: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('attachFile', { prevSubject: 'element' }, (subject, fileName: string) => {
  cy.wrap(subject).selectFile({
    contents: Cypress.Buffer.from('file contents'),
    fileName,
    lastModified: Date.now(),
  })
})
