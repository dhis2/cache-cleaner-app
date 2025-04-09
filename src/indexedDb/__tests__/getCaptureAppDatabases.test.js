import 'fake-indexeddb/auto.js'
import crypto from 'crypto'
import { TextEncoder, TextDecoder } from 'util'
import * as dbModule from '../dbExists.js'
import { getCaptureAppDatabases } from '../getCaptureAppDatabases.js'

Object.assign(global, { TextDecoder, TextEncoder, crypto: crypto.webcrypto })

const hashSHA256 = async (input) => {
    const inputUint8 = new TextEncoder().encode(input)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const deleteDatabases = (databases) =>
    Promise.all(
        databases.map(
            (database) =>
                new Promise((resolve, reject) => {
                    const request = window.indexedDB.open(database)
                    request.onerror = reject
                    request.onsuccess = () => {
                        request.result.close()
                        const closeRequest =
                            window.indexedDB.deleteDatabase(database)
                        closeRequest.onsuccess = resolve
                        closeRequest.onerror = reject
                    }
                })
        )
    )

describe('indexedDB - getCaptureAppDatabases', () => {
    const baseUrl = 'http://localhost:8080'
    const indexedDB = window.indexedDB

    const createDb = (name) =>
        new Promise((resolve, reject) => {
            const request = window.indexedDB.open(name)

            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        })

    beforeEach(() => {
        // Reset to the fake indexedDB in case it was overwritten
        window.indexedDB = indexedDB
    })

    it('should return some capture app databases for old versions', async () => {
        const captureAppDb = 'dhis2ca'
        const userIds = ['foo', 'bar']
        const userDatabases = userIds.map((id) => `${captureAppDb}${id}`)
        const allDatabases = [captureAppDb, ...userDatabases]
        try {
            // create DBs
            await Promise.all(userDatabases.map((dbName) => createDb(dbName)))

            // create capture app DB with object store
            const db = await new Promise((resolve, reject) => {
                const request = window.indexedDB.open(captureAppDb)

                request.onerror = reject

                request.onupgradeneeded = (event) => {
                    const db = event.target.result
                    db.createObjectStore('userCaches')
                }

                request.onsuccess = (event) => {
                    const db = event.target.result
                    resolve(db)
                }
            })

            // add user database names to capture app db
            await new Promise((resolve, reject) => {
                const transaction = db.transaction(['userCaches'], 'readwrite')

                transaction.oncomplete = () => {
                    db.close()
                    resolve()
                }

                transaction.onerror = () => {
                    db.close()
                    reject()
                }

                const newObjectStore = transaction.objectStore('userCaches')
                newObjectStore.put({ values: userDatabases }, 'accessHistory')
            })

            const captureAppDatabases = await getCaptureAppDatabases(baseUrl)
            expect(captureAppDatabases).toEqual(allDatabases)
        } finally {
            // Clean up databases
            await deleteDatabases(allDatabases)
        }
    })

    it('should return some capture app databases for new versions', async () => {
        const captureAppDb = `dhis2ca-${await hashSHA256(baseUrl)}`
        const userIds = ['user1', 'user2']
        const metadataDatabases = userIds.map((id) => `${captureAppDb}-${id}`)
        const offlineDataDatabases = metadataDatabases.map(
            (metadataDb) => `${metadataDb}-offline`
        )
        const userDatabases = [...metadataDatabases, ...offlineDataDatabases]
        const allDatabases = [captureAppDb, ...userDatabases]
        try {
            // create DBs
            await Promise.all(userDatabases.map((dbName) => createDb(dbName)))

            // create capture app DB with object store
            const db = await new Promise((resolve, reject) => {
                const request = window.indexedDB.open(captureAppDb)

                request.onerror = reject

                request.onupgradeneeded = (event) => {
                    const db = event.target.result
                    db.createObjectStore('userCaches')
                }

                request.onsuccess = (event) => {
                    const db = event.target.result
                    resolve(db)
                }
            })

            // add user database names to capture app db
            await new Promise((resolve, reject) => {
                const transaction = db.transaction(['userCaches'], 'readwrite')

                transaction.oncomplete = () => {
                    db.close()
                    resolve()
                }

                transaction.onerror = () => {
                    db.close()
                    reject()
                }

                const newObjectStore = transaction.objectStore('userCaches')
                newObjectStore.put(
                    { values: metadataDatabases },
                    'accessHistory'
                )
                newObjectStore.put(
                    { values: offlineDataDatabases },
                    'offlineDataAccessHistory'
                )
            })

            const captureAppDatabases = await getCaptureAppDatabases(baseUrl)
            expect(captureAppDatabases).toEqual(allDatabases)
        } finally {
            // Clean up databases
            await deleteDatabases(allDatabases)
        }
    })

    it('should return some capture app databases for all app versions', async () => {
        const userIds = ['user1', 'user2']

        const captureAppDbOld = 'dhis2ca'
        const userDatabasesOld = userIds.map((id) => `${captureAppDbOld}${id}`)

        const captureAppDbNew = `dhis2ca-${await hashSHA256(baseUrl)}`
        const metadataDatabasesNew = userIds.map(
            (id) => `${captureAppDbNew}-${id}`
        )
        const offlineDataDatabasesNew = metadataDatabasesNew.map(
            (metadataDb) => `${metadataDb}-offline`
        )
        const userDatabasesNew = [
            ...metadataDatabasesNew,
            ...offlineDataDatabasesNew,
        ]

        const captureAppDbNewOtherInstance = `dhis2ca-${await hashSHA256(
            'http://localhost:8081'
        )}`
        const metadataDatabasesNewOtherInstance = userIds.map(
            (id) => `${captureAppDbNewOtherInstance}-${id}`
        )
        const offlineDataDatabasesNewOtherInstance =
            metadataDatabasesNewOtherInstance.map(
                (metadataDb) => `${metadataDb}-offline`
            )
        const userDatabasesNewOtherInstance = [
            ...metadataDatabasesNewOtherInstance,
            ...offlineDataDatabasesNewOtherInstance,
        ]

        const databasesForInstance = [
            captureAppDbOld,
            ...userDatabasesOld,
            captureAppDbNew,
            ...userDatabasesNew,
        ]
        const allDatabases = [
            ...databasesForInstance,
            captureAppDbNewOtherInstance,
            ...userDatabasesNewOtherInstance,
        ]

        try {
            const createDBSet = async (
                mainDb,
                metadataDatabases,
                offlineDataDatabases = []
            ) => {
                // create DBs
                await Promise.all(
                    [...metadataDatabases, ...offlineDataDatabases].map(
                        (dbName) => createDb(dbName)
                    )
                )

                // create capture app DB with object store
                const db = await new Promise((resolve, reject) => {
                    const request = window.indexedDB.open(mainDb)

                    request.onerror = reject

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result
                        db.createObjectStore('userCaches')
                    }

                    request.onsuccess = (event) => {
                        const db = event.target.result
                        resolve(db)
                    }
                })

                // add user database names to capture app db
                await new Promise((resolve, reject) => {
                    const transaction = db.transaction(
                        ['userCaches'],
                        'readwrite'
                    )

                    transaction.oncomplete = () => {
                        db.close()
                        resolve()
                    }

                    transaction.onerror = () => {
                        db.close()
                        reject()
                    }

                    const newObjectStore = transaction.objectStore('userCaches')
                    newObjectStore.put(
                        { values: metadataDatabases },
                        'accessHistory'
                    )
                    offlineDataDatabases &&
                        newObjectStore.put(
                            { values: offlineDataDatabases },
                            'offlineDataAccessHistory'
                        )
                })
            }

            await Promise.all([
                createDBSet(captureAppDbOld, userDatabasesOld),
                createDBSet(
                    captureAppDbNew,
                    metadataDatabasesNew,
                    offlineDataDatabasesNew
                ),
                createDBSet(
                    captureAppDbNewOtherInstance,
                    metadataDatabasesNewOtherInstance,
                    offlineDataDatabasesNewOtherInstance
                ),
            ])

            const captureAppDatabases = await getCaptureAppDatabases(baseUrl)
            expect(captureAppDatabases).toEqual(databasesForInstance)
        } finally {
            // Clean up databases
            await deleteDatabases(allDatabases)
        }
    })

    it('should return an empty array if there is no capture app database', () => {
        return expect(getCaptureAppDatabases(baseUrl)).resolves.toEqual([])
    })

    it('should return an empty array if indexedDB is not available', async () => {
        delete window.indexedDB
        return expect(getCaptureAppDatabases(baseUrl)).resolves.toEqual([])
    })

    it('should close the database connection after evaluation when the database exists', async () => {
        const dbExists = jest.spyOn(dbModule, 'dbExists')
        dbExists.mockImplementation(() => Promise.resolve(true))
        const closeMock = jest.fn()

        window.indexedDB.open = jest.fn(() => {
            const mockedReturn = {
                result: {
                    close: closeMock,
                },
            }

            setTimeout(() => {
                mockedReturn.onsuccess()
            }, 0)

            return mockedReturn
        })

        await getCaptureAppDatabases(baseUrl)
        expect(closeMock).toHaveBeenCalledTimes(2)
    })
})
