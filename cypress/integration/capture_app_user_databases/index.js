import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const userCaches = ['dhis2caFoo', 'dhis2caBar']

const deleteDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.deleteDatabase(name)

        request.onsuccess = () => {
            expect(request.result).to.equal(undefined)
            resolve()
        }

        request.onerror = reject
    })

const recreateObjectStore = (db, name) => {
    db.createObjectStore(name)
}

const openDb = (win, name, objectStoreName) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.open(name)

        request.onerror = reject

        objectStoreName &&
            (request.onupgradeneeded = (event) => {
                const db = event.target.result
                recreateObjectStore(db, objectStoreName)
            })

        request.onsuccess = (event) => {
            const db = event.target.result
            resolve(db)
        }
    })

const addData = (db, objectStoreName) =>
    new Promise((resolve, reject) => {
        const transaction = db.transaction([objectStoreName], 'readwrite')
        transaction.oncomplete = resolve
        transaction.onerror = reject

        // add user ids with custom indexedDBs
        const newObjectStore = transaction.objectStore(objectStoreName)
        newObjectStore.put({ values: userCaches }, 'accessHistory')
    })

const createDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.open(name)

        request.onsuccess = () => {
            request.result.close()
            resolve()
        }

        request.onerror = reject
    })

Given('some user databases exist', () => {
    const objectStoreName = 'userCaches'

    // make sure the page has finished loading
    // so all connections to databases have been closed
    cy.get('h1', { log: false })

    cy.window().then(async (win) => {
        await deleteDb(win, 'dhis2ca')

        // create user dbs
        await Promise.all(
            userCaches.map((userCache) => createDb(win, userCache))
        )

        // create and open dhis2ca db
        const db = await openDb(win, 'dhis2ca', objectStoreName)

        // add names of user dbs to dhis2ca db
        await addData(db, objectStoreName)

        db.close()
    })

    // Reload to ensure that DBs are being persisted
    cy.reload()

    cy.window().then(async (win) => {
        // create and open dhis2ca db
        const db = await openDb(win, 'dhis2ca', objectStoreName)

        await new Promise((resolve, reject) => {
            // access store
            const objectStore = db
                .transaction(objectStoreName, 'readwrite')
                .objectStore(objectStoreName)

            // access value of an entry whos "keyPath" equals "accessHistory"
            const useridsReq = objectStore.get('accessHistory')

            useridsReq.onsuccess = (event) => {
                const result = event.target.result
                const dbnames = result.values

                expect(dbnames).to.eql(userCaches)
                resolve()
            }

            useridsReq.onerror = reject
        })

        db.close()
    })

    cy.get('input[value="dhis2ca"]').should('exist')
})

When('the user deletes the dhis2ca database', () => {
    cy.getWithDataTest('{selectall}').click()
    cy.getWithDataTest('{clear-top}').click()
    cy.getWithDataTest('{loading}')
    cy.get('h1')
})

Then('the user databases should be deleted as well', () => {
    cy.get('[value="dhis2ca"]').should('not.exist')
    cy.window().then((win) => {
        return ['dhis2ca', ...userCaches].forEach((dbName) => {
            // use a cy command to ensure sequential execution
            cy.wrap(dbName).then(async (name) => {
                const db = await openDb(win, name)
                expect(db.target).to.equal(undefined)
                db.close()
            })
        })
    })
})
