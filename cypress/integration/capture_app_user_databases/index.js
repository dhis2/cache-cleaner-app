import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const userCaches = ['foo', 'bar']

const deleteDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.deleteDatabase(name)
        request.onsuccess = resolve
        request.onerror = reject
    })

const recreateObjectStore = (db, name) => {
    db.createObjectStore(name)
}

const openDb = (win, name, objectStoreName) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.open(name)

        request.onerror = reject

        request.onupgradeneeded = event => {
            const db = event.target.result
            recreateObjectStore(db, objectStoreName)
        }

        request.onsuccess = event => {
            const db = event.target.result
            resolve(db)
        }
    })

const addData = (db, objectStoreName) =>
    new Promise((resolve, reject) => {
        const transaction = db.transaction([objectStoreName], 'readwrite')
        transaction.oncomplete = () => resolve(db)
        transaction.onerror = reject

        // add user ids with custom indexedDBs
        const newObjectStore = transaction.objectStore(objectStoreName)
        newObjectStore.put({ values: userCaches }, 'accessHistory')
    })

Given('some user databases exist', () => {
    const objectStoreName = 'userCaches'

    // delete possibly existing DBs
    cy.window().then(win => {
        deleteDb(win, 'dhis2ca')
        return win
    })

    userCaches.forEach(userCache => {
        cy.window().then(win => {
            deleteDb(win, `dhis2ca${userCache}`)
        })
    })

    // create user dbs
    userCaches.forEach(userCache => {
        cy.window().then(win => {
            win.indexedDB.open(`dhis2ca${userCache}`)
        })
    })

    // set user dbs
    cy.window()

        // for some reason this needs an absurdly high timeout
        .then({ timeout: 10000000000 }, win => {
            return openDb(win, 'dhis2ca', objectStoreName)
        })

        .then(db => addData(db, objectStoreName))

    // confirm dbs have been set
    cy.reload()
    cy.window()
        .then({ timeout: 10000000000 }, win => {
            const objectStoreName = 'userCaches'

            return new Promise(resolve => {
                // open db
                const request = win.indexedDB.open('dhis2ca')
                request.onerror = () => resolve([])

                // db successfully opened
                request.onsuccess = event => {
                    const db = event.target.result

                    // access store
                    const objectStore = db
                        .transaction(objectStoreName, 'readwrite')
                        .objectStore(objectStoreName)

                    // access value of an entry whos "keyPath" equals "accessHistory"
                    const useridsReq = objectStore.get('accessHistory')

                    useridsReq.onsuccess = event => {
                        var result = event.target.result
                        var dbnames =
                            result && result.values ? result.values : []
                        resolve(dbnames)
                    }

                    useridsReq.onerror = () => resolve([])
                }
            })
        })
        .should(dbnames => {
            expect(dbnames).to.eql(userCaches)
        })
})

When('the user deletes the dhis2ca database', () => {
    cy.get('{selectall}').click()
    cy.get('{clear-top}').click()
    cy.get('h1')
})

Then('the user databases should be deleted as well', () => {
    cy.get('[value="dhis2ca"]').should('not.exist')
    cy.window()
        .then({ timeout: 10000000000 }, win => {
            const objectStoreName = 'userCaches'

            return new Promise(resolve => {
                // open db
                const request = win.indexedDB.open('dhis2ca')
                request.onerror = () => resolve([])

                // db successfully opened
                request.onsuccess = event => {
                    const db = event.target.result

                    // access store
                    const objectStore = db
                        .transaction(objectStoreName, 'readwrite')
                        .objectStore(objectStoreName)

                    // access value of an entry whos "keyPath" equals "accessHistory"
                    const useridsReq = objectStore.get('accessHistory')

                    useridsReq.onsuccess = event => {
                        var result = event.target.result
                        var dbnames =
                            result && result.values ? result.values : []
                        resolve(dbnames)
                    }

                    useridsReq.onerror = () => resolve([])
                }
            })
        })
        .should(dbnames => {
            expect(dbnames).to.eql([])
        })
})
