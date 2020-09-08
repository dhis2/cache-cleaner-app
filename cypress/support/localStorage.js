const localStorage = () => cy.window().then(win => win.localStorage)

Cypress.Commands.add('localStorage', localStorage)
