const addDataToObjectStore = (db, objectStoreName, data) =>
    new Promise((resolve, reject) => {
        const transaction = db.transaction([objectStoreName], 'readwrite')

        transaction.oncomplete = () => {
            resolve(db)
        }

        transaction.onerror = reject

        const newObjectStore = transaction.objectStore(objectStoreName)

        // add user ids with custom indexedDBs
        newObjectStore.put(data, 'accessHistory')
    })

Cypress.Commands.add(
    'addDataToObjectStore',
    { prevSubject: true },
    addDataToObjectStore
)
