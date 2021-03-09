import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given(
    /the (.*) in the (.*) storage is reserved and has a value/,
    (key, type) => {
        const item = { name: key, value: key }

        // Set storage items
        if (type === 'local') {
            cy.localStorage().setItems([item])
        } else {
            cy.sessionStorage().setItems([item])
        }

        // Reload so storage items are being displayed
        cy.reload()

        // Wait for reload to finish by expecting a dom change.
        // Using "name" as value as the storage key is displayed,
        // the value of the storage item is irrelevant
        cy.get(`[value="${key}"]`)
    }
)

Then(/the (.*) should be in the (.*) list/, (key, type) => {
    const storageSelector =
        type === 'local' ? '{localstoragekeys}' : '{sessionstoragekeys}'

    cy.get(storageSelector).find(`[value="${key}"]`).should('exist')
})
