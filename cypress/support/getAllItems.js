const getAllItems = (storage) => {
    // this way we won't get all the internal properties
    const entries = Object.entries(storage)
    const allItems = entries.reduce(
        (items, [name, value]) => ({ ...items, [name]: value }),
        {}
    )

    return cy.wrap(allItems)
}

Cypress.Commands.add('getAllItems', { prevSubject: true }, getAllItems)
