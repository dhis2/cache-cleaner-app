const storage = (name) => {
    if (name === 'local') {
        return cy.localStorage()
    }
    if (name === 'session') {
        return cy.sessionStorage()
    }

    throw new Error(`Unrecognized "name" provided, got "${name}"`)
}

Cypress.Commands.add('storage', storage)
