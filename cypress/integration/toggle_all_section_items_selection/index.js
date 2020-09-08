import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const getStorageSelector = type => {
    if (type === 'local') return '{localstoragekeys}'
    if (type === 'session') return '{sessionstoragekeys}'
    if (type === 'indexedDb') return '{indexeddatabasekeys}'
}

const setInitialState = () => {
    cy.get('@section')
        .find('[type="checkbox"]')
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

Given(/the (.*) has items/, section => {
    const selector = getStorageSelector(section)
    cy.get(selector).as('section')

    const items = ['dhis2ou', 'dhis2', 'dhis2tc']

    if (section === 'local' || section === 'session') {
        const storageItems = items.map(name => ({ name, value: name }))
        cy.storage(section).setItems(storageItems)
    }

    if (section === 'indexedDb') {
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
    }

    cy.reload()
    setInitialState()
})

Given('no item is selected', () => {
    cy.get('@section')
        .find(':checked')
        .should('not.exist')

    setInitialState()
})

Given('all item are selected', () => {
    cy.get('@section')
        .find('[type="checkbox"]')
        .should('not.be.checked')
        .parent()
        .click({ multiple: true })

    setInitialState()
})

When('the user clicks the select-all button of that section', () => {
    cy.get('@section')
        .find('{formsection-selectall}')
        .click()
})

When('the user clicks the deselect-all button of that section', () => {
    cy.get('@section')
        .find('{formsection-deselectall}')
        .click()
})

Then('all checkbox in the section should be selected', () => {
    cy.get('@section')
        .find('[type="checkbox"]')
        .should('be.checked')
})

Then('no checkbox in the section should be selected', () => {
    cy.get('@section')
        .find(':checked')
        .should('not.exist')
})

Then('no selected state should change', () => {
    const getCurrentState = () =>
        cy
            .get('@section')
            .find('[type="checkbox"]')
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
