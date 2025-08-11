import 'fake-indexeddb/auto.js'
import crypto from 'crypto'
import { TextEncoder, TextDecoder } from 'util'
import * as dbExistsModule from '../dbExists.js'
import { getCaptureAppDatabases } from '../getCaptureAppDatabases.js'

Object.assign(global, { TextDecoder, TextEncoder, crypto: crypto.webcrypto })

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
    const baseUrlHash =
        'a76d8c3e94eba61fc46b5cc05fc51e5f6df1d0f46d901d32e9c27bb251f155ae'
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

    const createDBSet = async (
        mainDb,
        { userDatabases, userMetadataDatabases, userDataDatabases }
    ) => {
        // create DBs
        await Promise.all(
            [
                ...(userDatabases || []),
                ...(userMetadataDatabases || []),
                ...(userDataDatabases || []),
            ].map((dbName) => createDb(dbName))
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
            userDatabases &&
                newObjectStore.put({ values: userDatabases }, 'accessHistory')
            userMetadataDatabases &&
                newObjectStore.put(
                    { values: userMetadataDatabases },
                    'accessHistoryMetadata'
                )
            userDataDatabases &&
                newObjectStore.put(
                    { values: userDataDatabases },
                    'accessHistoryData'
                )
        })
    }

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
            await createDBSet(captureAppDb, { userDatabases })
            const captureAppDatabases = await getCaptureAppDatabases(baseUrl)
            expect(captureAppDatabases).toEqual(allDatabases)
        } finally {
            // Clean up databases
            await deleteDatabases(allDatabases)
        }
    })

    it('should return some capture app databases for new versions', async () => {
        const captureAppDb = `dhis2ca-${baseUrlHash}`
        const userIds = ['user1', 'user2']
        const userMetadataDatabases = userIds.map(
            (id) => `${captureAppDb}-${id}-metadata`
        )
        const userDataDatabases = userIds.map(
            (id) => `${captureAppDb}-${id}-data`
        )
        const userDatabases = [...userMetadataDatabases, ...userDataDatabases]
        const allDatabases = [captureAppDb, ...userDatabases]
        try {
            await createDBSet(captureAppDb, {
                userMetadataDatabases,
                userDataDatabases,
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

        const captureAppDbNew = `dhis2ca-${baseUrlHash}`
        const metadataDatabasesNew = userIds.map(
            (id) => `${captureAppDbNew}-${id}-metadata`
        )
        const dataDatabasesNew = userIds.map(
            (id) => `${captureAppDbNew}-${id}-data`
        )
        const userDatabasesNew = [...metadataDatabasesNew, ...dataDatabasesNew]

        // hash for http://localhost:8081
        const otherInstanceUrlHash =
            'b213eceaa0ae58456e20c6d87bb2cfe9825302cb8d9b9db30e0f22be97eadcff'
        const captureAppDbNewOtherInstance = `dhis2ca-${otherInstanceUrlHash}`

        const metadataDatabasesNewOtherInstance = userIds.map(
            (id) => `${captureAppDbNewOtherInstance}-${id}-metadata`
        )
        const dataDatabasesNewOtherInstance = userIds.map(
            (id) => `${captureAppDbNewOtherInstance}-${id}-data`
        )
        const userDatabasesNewOtherInstance = [
            ...metadataDatabasesNewOtherInstance,
            ...dataDatabasesNewOtherInstance,
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
            await Promise.all([
                createDBSet(captureAppDbOld, {
                    userDatabases: userDatabasesOld,
                }),
                createDBSet(captureAppDbNew, {
                    userMetadataDatabases: metadataDatabasesNew,
                    userDataDatabases: dataDatabasesNew,
                }),
                createDBSet(captureAppDbNewOtherInstance, {
                    userMetadataDatabases: metadataDatabasesNewOtherInstance,
                    userDataDatabases: dataDatabasesNewOtherInstance,
                }),
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
        const dbExistsSpy = jest
            .spyOn(dbExistsModule, 'dbExists')
            .mockImplementation(() => Promise.resolve(true))
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
        dbExistsSpy.mockRestore()
    })
})
