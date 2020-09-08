const sessionStorage = () => cy.window().then(win => win.sessionStorage)

Cypress.Commands.add('sessionStorage', sessionStorage)
