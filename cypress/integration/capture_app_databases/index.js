import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'
import { dbExists, deleteDb } from '../../support/common/index.js'

const instanceDbNameOld = 'dhis2ca'
const userCachesOld = ['dhis2causer1', 'dhis2causer2']

let instanceDbNameNew
let userCachesNew
let userCachesNewOfflineData

Before(async () => {
    instanceDbNameNew = `dhis2ca-${await hashSHA256(
        Cypress.env('dhis2BaseUrl')
    )}`
    userCachesNew = ['userId1', 'userId2'].map(
        (userId) => `${instanceDbNameNew}-${userId}`
    )
    userCachesNewOfflineData = userCachesNew.map(
        (userCache) => `${userCache}-offline`
    )
})

const hashSHA256 = async (input) => {
    const inputUint8 = new TextEncoder().encode(input)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

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

const addData = (db, objectStoreName, { userCaches, userCachesOfflineData }) =>
    new Promise((resolve, reject) => {
        const transaction = db.transaction([objectStoreName], 'readwrite')
        transaction.oncomplete = resolve
        transaction.onerror = reject

        // add user ids with custom indexedDBs
        const newObjectStore = transaction.objectStore(objectStoreName)
        newObjectStore.put({ values: userCaches }, 'accessHistory')
        if (userCachesOfflineData) {
            newObjectStore.put(
                { values: userCachesOfflineData },
                'offlineDataAccessHistory'
            )
        }
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

const createDatabasesForOldAppVersion = async (win, objectStoreName) => {
    await deleteDb(win, instanceDbNameOld)

    // create user dbs
    await Promise.all(
        userCachesOld.map((userCache) => createDb(win, userCache))
    )

    // create and open dhis2ca db
    const db = await openDb(win, instanceDbNameOld, objectStoreName)

    // add names of user dbs to dhis2ca db
    await addData(db, objectStoreName, { userCaches: userCachesOld })

    db.close()
}

const createDatabasesForNewAppVersion = async (win, objectStoreName) => {
    await deleteDb(win, instanceDbNameNew)

    // create user dbs
    await Promise.all(
        userCachesNew.map((userCache) => createDb(win, userCache))
    )

    await Promise.all(
        userCachesNewOfflineData.map((userCache) => createDb(win, userCache))
    )

    // create and open dhis2ca db
    const db = await openDb(win, instanceDbNameNew, objectStoreName)

    // add names of user dbs to dhis2ca db
    await addData(db, objectStoreName, {
        userCaches: userCachesNew,
        userCachesOfflineData: userCachesNewOfflineData,
    })

    db.close()
}

const getNamesFromDb = async (win, instanceDb, objectStoreName) => {
    const db = await openDb(win, instanceDb, objectStoreName)

    return new Promise((resolve, reject) => {
        // access store
        const objectStore = db
            .transaction(objectStoreName, 'readwrite')
            .objectStore(objectStoreName)

        // access value of an entry whos "keyPath" equals "accessHistory"
        const accessHistoryRequest = objectStore.get('accessHistory')

        accessHistoryRequest.onsuccess = (accessHistoryEvent) => {
            const offlineDataRequest = objectStore.get(
                'offlineDataAccessHistory'
            )

            offlineDataRequest.onsuccess = (offlineDataEvent) => {
                resolve({
                    userCaches: accessHistoryEvent.target.result.values,
                    userCachesOfflineData:
                        offlineDataEvent.target.result?.values,
                })
                db.close()
            }

            offlineDataRequest.onerror = reject
        }

        accessHistoryRequest.onerror = reject
    })
}

Given('some Capture app databases exist', () => {
    const objectStoreName = 'userCaches'

    // make sure the page has finished loading
    // so all connections to databases have been closed
    cy.get('h1', { log: false })

    cy.window().then(async (win) => {
        await createDatabasesForOldAppVersion(win, objectStoreName)
        await createDatabasesForNewAppVersion(win, objectStoreName)
    })

    // Reload to ensure that DBs are being persisted
    cy.reload()

    cy.window().then(async (win) => {
        const { userCaches: userCachesFromDbOld } = await getNamesFromDb(
            win,
            instanceDbNameOld,
            objectStoreName
        )
        expect(userCachesFromDbOld).to.eql(userCachesOld)

        const {
            userCaches: userCachesFromDbNew,
            userCachesOfflineData: userCachesOfflineDataFromDbNew,
        } = await getNamesFromDb(win, instanceDbNameNew, objectStoreName)
        expect(userCachesFromDbNew).to.eql(userCachesNew)
        expect(userCachesOfflineDataFromDbNew).to.eql(userCachesNewOfflineData)
    })

    cy.get('input[value="dhis2ca"]').should('exist')
})

When('the user clears dhis2ca', () => {
    cy.getWithDataTest('{selectall}').click()
    cy.getWithDataTest('{clear-top}').click()
    cy.getWithDataTest('{loading}')
    cy.get('h1')
})

Then('all the Capture app databases should be deleted', () => {
    cy.get('[value="dhis2ca"]').should('not.exist')
    cy.window().then((win) => {
        return [
            instanceDbNameOld,
            ...userCachesOld,
            instanceDbNameNew,
            ...userCachesNew,
            ...userCachesNewOfflineData,
        ].forEach((dbName) => {
            // use a cy command to ensure sequential execution
            cy.wrap(dbName).then(async (name) => {
                const exists = await dbExists(win, name)
                expect(exists).to.equal(false)
            })
        })
    })
})
