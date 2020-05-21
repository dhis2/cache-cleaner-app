/**
 * @param {Storage} storage
 * @param {Array.<{ name: string, value: any }>} items
 * @returns {cy}
 */
const setItems = (storage, items) => {
    items.forEach(({ name, value }) => storage.setItem(name, value))
    return cy.wrap(storage)
}

Cypress.Commands.add('setItems', { prevSubject: true }, setItems)
