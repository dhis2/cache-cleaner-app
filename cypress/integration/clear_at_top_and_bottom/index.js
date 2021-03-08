import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('some items exist', () => {
    const items = [
        { name: 'foo', value: 'Foo' },
        { name: 'bar', value: 'Bar' },
        { name: 'baz', value: 'Baz' },
    ]

    // Set storage items
    cy.localStorage().setItems(items)

    // Reload so storage items are being displayed
    cy.reload()

    // Wait for reload to finish by expecting a dom change.
    // Using "name" as value as the storage key is displayed,
    // the value of the storage item is irrelevant
    cy.get(`[value="${items[0].name}"]`)
})

Given('some storage items have been selected', () => {
    cy.get('[type="checkbox"]').first().as('selectedCheckbox')

    cy.get('@selectedCheckbox').parent().click()

    cy.get('@selectedCheckbox').then($checkbox => {
        const name = $checkbox.attr('name')
        const value = $checkbox.attr('value')
        cy.wrap([{ name, value }]).as('selected')
    })
})

Given('the clear button at the top is enabled', () => {
    cy.get('{clear-top}')
        .should('exist')
        .invoke('filter', ':disabled')
        .should('not.exist')
})

Given('the clear button at the bottom is enabled', () => {
    cy.get('{clear-bottom}')
        .should('exist')
        .invoke('filter', ':disabled')
        .should('not.exist')
})

When('the user clicks the clear button at the top', () => {
    cy.get('{clear-top}').click()
})

When('the user clicks the clear button at the bottom', () => {
    cy.get('{clear-bottom}').click()
})

Then('the selected storage items should be deleted', () => {
    cy.get('@selected').then(selected => {
        selected.forEach(({ name, value }) => {
            cy.get(`[name="${name}"][value="${value}"]`).should('not.exist')
        })
    })
})
