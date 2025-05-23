import { dbExists } from './common/index.js'

const dhis2DatabaseNames = [
    'dhis2ou',
    'dhis2',
    'dhis2tc',
    'dhis2ec',
    'dhis2de',
    'dhis2er',
    'dhis2ca',
]

const sum = (numbers) =>
    numbers.reduce((curSum, curNumber) => curSum + curNumber, 0)

const storageShouldHaveItems = (storageType) => {
    if (storageType === 'indexedDb') {
        cy.window().then(async (win) => {
            const existenceMap = await Promise.all(
                dhis2DatabaseNames.map(
                    (dbName) =>
                        new Promise((resolve) => {
                            dbExists(win, dbName).then((exists) =>
                                exists ? resolve(1) : resolve(0)
                            )
                        })
                )
            )

            const existingDbCount = sum(existenceMap)
            expect(existingDbCount).to.equal(0)
        })
    } else {
        cy.storage(storageType).should((storage) => {
            expect(storage.length).to.equal(0)
        })
    }
}

Cypress.Commands.add('storageShouldHaveItems', storageShouldHaveItems)
