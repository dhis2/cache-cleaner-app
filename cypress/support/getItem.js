const getItem = (storage, name) => {
    storage.getItem(name)
    return cy.wrap(storage)
}

Cypress.Commands.add('getItem', { prevSubject: true }, getItem)
