const dhis2DatabaseNames = [
    'dhis2ou',
    'dhis2',
    'dhis2tc',
    'dhis2ec',
    'dhis2de',
    'dhis2er',
    'dhis2ca',
]

const openDb = (win, name) =>
    new Promise(resolve => {
        const request = win.indexedDB.open(name)

        request.onsuccess = () => {
            request.result.close()
            resolve(request)
        }
    })

const delDb = (win, name) =>
    new Promise((resolve, reject) => {
        const delRequest = window.indexedDB.deleteDatabase(name)
        delRequest.onsuccess = resolve
        delRequest.onerror = reject
    })

const clearStorage = name => {
    if (name === 'local' || name === 'session') {
        cy.storage(name).then(storage => storage.clear())
    }

    if (name === 'indexedDb') {
        cy.window().then(async win => {
            // clear indexedDBs
            await Promise.all(
                dhis2DatabaseNames.map(name =>
                    // opening a db will inevitably create one
                    // -> clearing pre-existing DBs = open + delete
                    openDb(win, name).then(() => delDb(win, name))
                )
            )
        })
    }

    return cy
}

Cypress.Commands.add('clearStorage', clearStorage)
