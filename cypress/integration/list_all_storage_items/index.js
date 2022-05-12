import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

const items = ['foo', 'bar', 'baz']

const dhis2DatabaseNames = [
    'dhis2ou',
    'dhis2',
    'dhis2tc',
    'dhis2ec',
    'dhis2de',
    'dhis2er',
    'dhis2ca',
]

const getStorageSelector = (type) => {
    if (type === 'local') {
        return '{localstoragekeys}'
    }
    if (type === 'session') {
        return '{sessionstoragekeys}'
    }
    if (type === 'indexedDb') {
        return '{indexeddatabasekeys}'
    }
}

Given(/some items are stored in the (.*) storage/, (type) => {
    cy.wrap(type).as('storageType')

    const storedNames =
        type === 'local' || type === 'session' ? items : dhis2DatabaseNames
    cy.wrap(storedNames).as('storedNames')

    if (type === 'local' || type === 'session') {
        // Set storage items
        const storageItems = storedNames.map((name) => ({ name, value: name }))
        cy.storage(type).setItems(storageItems)
    } else if (type === 'indexedDb') {
        // Create indexedDBs
        // By opening & closing a DB, it's being created
        cy.window().then(async (win) => {
            const requests = storedNames.map((name) => {
                return new Promise((resolve) => {
                    const request = win.indexedDB.open(name, 1)
                    request.onsuccess = () => resolve(request)
                })
            })

            await Promise.all(requests).then((indexedDbRequests) => {
                indexedDbRequests.forEach((request) => request.result.close())
            })
        })
    }

    // Reload so storage items are being displayed
    cy.reload()

    // Wait for reload to finish by expecting a dom change.
    // Using "name" as value as the storage key is displayed,
    // the value of the storage item is irrelevant
    cy.get('@storedNames').then((storedNames) =>
        cy.get(`[value="${storedNames[0]}"]`)
    )
})

Given(/no items are stored in the (.*) storage/, (type) => {
    cy.wrap(type).as('storageType')
    cy.clearStorage(type)
    cy.reload()

    // wait for loading to finish
    // Otherwise we'll try to access a database
    // that the app already has an open connection with
    cy.getWithDataTest('{homeheadline}').should('exist')

    cy.storageShouldHaveItems(type)
})

Then('all items should be listed as clearable', () => {
    cy.all(
        () => cy.get('@storageType'),
        () => cy.get('@storedNames')
    ).then(([type, storedNames]) => {
        const storageSelector = getStorageSelector(type)
        storedNames.forEach((name) =>
            cy
                .getWithDataTest(`${storageSelector} [value="${name}"]`)
                .should('exist')
        )
    })
})

Then('the section should not show any checkboxes', () => {
    cy.get('@storageType').then((type) => {
        const storageSelector = getStorageSelector(type)
        cy.getWithDataTest(`${storageSelector} input`).should('not.exist')
    })
})

Then('a text explaining that no items exist should be displayed', () => {
    cy.get('@storageType').then((type) => {
        const storageSelector = getStorageSelector(type)
        cy.getWithDataTest(`${storageSelector} {emptystoragemessage}`).should(
            'exist'
        )
    })
})
