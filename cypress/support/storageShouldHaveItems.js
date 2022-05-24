const dhis2DatabaseNames = [
    'dhis2ou',
    'dhis2',
    'dhis2tc',
    'dhis2ec',
    'dhis2de',
    'dhis2er',
    'dhis2ca',
]

const deleteDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.deleteDatabase(name)

        request.onsuccess = resolve
        request.onerror = reject
    })

const dbExists = (win, name) =>
    new Promise((resolve, reject) => {
        let alreadyExists = true
        const request = win.indexedDB.open(name)

        request.onsuccess = () => {
            request.result.close()

            if (!alreadyExists) {
                deleteDb(win, name).then(() => resolve(false))
            } else {
                resolve(true)
            }
        }

        request.onerror = (error) => reject(error)
        request.onupgradeneeded = () => (alreadyExists = false)
    })

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
