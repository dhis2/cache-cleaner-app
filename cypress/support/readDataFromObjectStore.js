const readDataFromObjectStore = (db, objectStoreName, key) =>
    new Promise((resolve, reject) => {
        const objectStore = db
            .transaction(objectStoreName, 'readwrite')
            .objectStore(objectStoreName)

        // access value of an entry whos "keyPath" equals "accessHistory"
        const useridsReq = objectStore.get(key)

        useridsReq.onsuccess = (event) => {
            var result = event.target.result
            var dbnames = result && result.values ? result.values : []
            resolve(dbnames)
        }

        useridsReq.onerror = reject
    })

Cypress.Commands.add(
    'readDataFromObjectStore',
    { prevSubject: true },
    readDataFromObjectStore
)
