import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'
import { dbExists, deleteDb } from '../../support/common/index.js'

const objectStoreNameForUserCaches = 'userCaches'

const instanceDbNameOld = 'dhis2ca'
const userCachesOld = ['dhis2causer1', 'dhis2causer2']

let instanceDbNameNew
let userCachesNewMetadata
let userCachesNewData

Before(async () => {
    instanceDbNameNew = `dhis2ca-${await hashSHA256(
        Cypress.env('dhis2BaseUrl')
    )}`

    const users = ['userId1', 'userId2']
    userCachesNewMetadata = users.map(
        (userId) => `${instanceDbNameNew}-${userId}-metadata`
    )
    userCachesNewData = users.map(
        (userId) => `${instanceDbNameNew}-${userId}-data`
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

const addData = (db, { userCaches, userCachesMetadata, userCachesData }) =>
    new Promise((resolve, reject) => {
        const transaction = db.transaction(
            [objectStoreNameForUserCaches],
            'readwrite'
        )
        transaction.oncomplete = resolve
        transaction.onerror = reject

        // add user ids with custom indexedDBs
        const newObjectStore = transaction.objectStore(
            objectStoreNameForUserCaches
        )
        userCaches &&
            newObjectStore.put({ values: userCaches }, 'accessHistory')
        userCachesMetadata &&
            newObjectStore.put(
                { values: userCachesMetadata },
                'accessHistoryMetadata'
            )
        userCachesData &&
            newObjectStore.put({ values: userCachesData }, 'accessHistoryData')
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

const createDatabasesForOldAppVersion = async (win) => {
    await deleteDb(win, instanceDbNameOld)

    // create user dbs
    await Promise.all(
        userCachesOld.map((userCache) => createDb(win, userCache))
    )

    // create and open dhis2ca db
    const db = await openDb(
        win,
        instanceDbNameOld,
        objectStoreNameForUserCaches
    )

    // add names of user dbs to dhis2ca db
    await addData(db, { userCaches: userCachesOld })

    db.close()
}

const createDatabasesForNewAppVersion = async (win) => {
    await deleteDb(win, instanceDbNameNew)

    // create user dbs
    await Promise.all(
        userCachesNewMetadata.map((userCache) => createDb(win, userCache))
    )

    await Promise.all(
        userCachesNewData.map((userCache) => createDb(win, userCache))
    )

    // create and open dhis2ca db
    const db = await openDb(
        win,
        instanceDbNameNew,
        objectStoreNameForUserCaches
    )

    // add names of user dbs to dhis2ca db
    await addData(db, {
        userCachesMetadata: userCachesNewMetadata,
        userCachesData: userCachesNewData,
    })

    db.close()
}

const getNamesFromDb = async (
    win,
    instanceDb,
    hasSeparateDatabaseForUserData = false
) => {
    const db = await openDb(win, instanceDb)

    return new Promise((resolve, reject) => {
        // access store
        const objectStore = db
            .transaction(objectStoreNameForUserCaches, 'readwrite')
            .objectStore(objectStoreNameForUserCaches)

        // access value of an entry whos "keyPath" equals "accessHistory"
        const accessHistoryRequest = objectStore.get(
            hasSeparateDatabaseForUserData
                ? 'accessHistoryMetadata'
                : 'accessHistory'
        )

        accessHistoryRequest.onsuccess = (accessHistoryEvent) => {
            if (!hasSeparateDatabaseForUserData) {
                resolve({
                    userCaches: accessHistoryEvent.target.result.values,
                })
                return
            }

            const accessHistoryDataRequest =
                objectStore.get('accessHistoryData')

            accessHistoryDataRequest.onsuccess = (accessHistoryDataEvent) => {
                resolve({
                    userCachesMetadata: accessHistoryEvent.target.result.values,
                    userCachesData:
                        accessHistoryDataEvent.target.result?.values,
                })
                db.close()
            }

            accessHistoryDataRequest.onerror = reject
        }

        accessHistoryRequest.onerror = reject
    })
}

Given('some Capture app databases exist', () => {
    // make sure the page has finished loading
    // so all connections to databases have been closed
    cy.get('h1', { log: false })

    cy.window().then(async (win) => {
        await createDatabasesForOldAppVersion(win)
        await createDatabasesForNewAppVersion(win)
    })

    // Reload to ensure that DBs are being persisted
    cy.reload()

    cy.window().then(async (win) => {
        const { userCaches: userCachesFromDbOld } = await getNamesFromDb(
            win,
            instanceDbNameOld
        )
        expect(userCachesFromDbOld).to.eql(userCachesOld)

        const {
            userCachesMetadata: userCachesMetadataFromDbNew,
            userCachesData: userCachesDataFromDbNew,
        } = await getNamesFromDb(win, instanceDbNameNew, true)
        expect(userCachesMetadataFromDbNew).to.eql(userCachesNewMetadata)
        expect(userCachesDataFromDbNew).to.eql(userCachesNewData)
    })

    cy.get('input[value="dhis2ca"]').should('exist')
})

When('the user clears dhis2ca', () => {
    cy.getWithDataTest('{selectall}').click()
    cy.getWithDataTest('{clear-top}').should('not.be.disabled')
    cy.getWithDataTest('{clear-top}').click()
    cy.getWithDataTest('{clear-top}').should('be.disabled')
    cy.get('h1')
})

Then('all the Capture app databases should be deleted', () => {
    cy.get('[value="dhis2ca"]').should('not.exist')
    cy.window().then((win) => {
        return [
            instanceDbNameOld,
            ...userCachesOld,
            instanceDbNameNew,
            ...userCachesNewMetadata,
            ...userCachesNewData,
        ].forEach((dbName) => {
            // use a cy command to ensure sequential execution
            cy.wrap(dbName).then(async (name) => {
                const exists = await dbExists(win, name)
                expect(exists).to.equal(false)
            })
        })
    })
})
