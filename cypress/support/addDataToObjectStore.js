const addDataToObjectStore = (db, objectStoreName, data) =>
    new Promise((resolve, reject) => {
        console.log('db', db)
        console.log('objectStoreName', objectStoreName)
        console.log('data', data)
        const transaction = db.transaction([objectStoreName], 'readwrite')

        transaction.oncomplete = () => {
            resolve(db)
        }

        transaction.onerror = e => {
            console.log('addData error', e)
            reject(e)
        }

        const newObjectStore = transaction.objectStore(objectStoreName)

        // add user ids with custom indexedDBs
        newObjectStore.put(data, 'accessHistory')
    })

Cypress.Commands.add(
    'addDataToObjectStore',
    { prevSubject: true },
    addDataToObjectStore
)
