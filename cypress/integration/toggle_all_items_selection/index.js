import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const setInitialState = () => {
    cy.get('[type="checkbox"]')
        .then($checkboxes => $checkboxes.filter(':checked'))
        .invoke('map', (index, checked) => {
            const $checked = Cypress.$(checked)

            return {
                name: $checked.attr('name'),
                value: $checked.attr('value'),
            }
        })
        .as('initialState')
}

Given('every section has items', () => {
    const items = ['dhis2ou', 'dhis2', 'dhis2tc']

    cy.storage('local').setItems(items.map(name => ({ name, value: name })))
    cy.storage('session').setItems(items.map(name => ({ name, value: name })))

    cy.window().then(async win => {
        await Promise.all(
            items.map(name => {
                return new Promise(resolve => {
                    const request = win.indexedDB.open(name)
                    request.onsuccess = resolve
                })
            })
        )
    })

    cy.reload()

    setInitialState()
})

Given('all items are selected', () => {
    cy.get('[type="checkbox"]').parent().click({ multiple: true })

    setInitialState()
})

Given('no item is selected', () => {
    cy.get('[type="checkbox"]').filter(':checked').should('not.exist')

    setInitialState()
})

When('the user clicks the select-all button for all sections', () => {
    cy.get('{selectall}').click()
})

When('the user clicks the deselect-all button for all sections', () => {
    cy.get('{deselectall}').click()
})

Then('all checkbox in all sections should be selected', () => {
    cy.get('[type="checkbox"]').should('be.checked')
})

Then('no selected state should change', () => {
    const getCurrentState = () =>
        cy
            .get('[type="checkbox"]')
            .then($checkboxes => $checkboxes.filter(':checked'))
            .invoke('map', (index, checked) => {
                const $checked = Cypress.$(checked)

                return {
                    name: $checked.attr('name'),
                    value: $checked.attr('value'),
                }
            })

    cy.all(() => cy.get('@initialState'), getCurrentState).then(
        ([initialState, currentState]) => {
            expect(currentState).to.eql(initialState)
        }
    )
})

Then('all checkbox in all sections should not be selected', () => {
    cy.get('[type="checkbox"]').filter(':checked').should('not.exist')
})
