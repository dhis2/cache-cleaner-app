import 'fake-indexeddb/auto'
import { dbExists } from '../dbExists'
import { getCaptureAppUserDatabases } from '../getCaptureAppUserDatabases'

jest.mock('../dbExists', () => ({
    dbExists: jest.fn(),
}))

describe('indexedDB - getCaptureAppUserDatabases', () => {
    const indexedDB = window.indexedDB
    const captureAppDb = 'dhis2ca'
    const userIds = ['foo', 'bar']
    const userDatabases = userIds.map(id => `${captureAppDb}${id}`)
    const allDatabases = [captureAppDb, ...userDatabases]

    const createDb = name =>
        new Promise((resolve, reject) => {
            const request = window.indexedDB.open(name)

            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        })

    beforeEach(async () => {
        // Reset to the fake indexedDB in case it was overwritten
        window.indexedDB = indexedDB

        // Make sure no DB exists before each test runs
        await Promise.all(
            allDatabases.map(
                userDatabase =>
                    new Promise((resolve, reject) => {
                        const request = window.indexedDB.open(userDatabase)
                        request.onerror = reject
                        request.onsuccess = () => {
                            request.result.close()
                            const closeRequest = window.indexedDB.deleteDatabase(
                                userDatabase
                            )
                            closeRequest.onsuccess = resolve
                            closeRequest.onerror = reject
                        }
                    })
            )
        )
    })

    afterEach(() => {
        dbExists.mockClear()
    })

    it('should return some user databases', async () => {
        dbExists.mockImplementationOnce(() => Promise.resolve(true))

        // create user DBs
        await Promise.all(userDatabases.map(dbName => createDb(dbName)))

        // create capture app DB with object store
        const db = await new Promise((resolve, reject) => {
            const request = window.indexedDB.open(captureAppDb)

            request.onerror = reject

            request.onupgradeneeded = event => {
                const db = event.target.result
                db.createObjectStore('userCaches')
            }

            request.onsuccess = event => {
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

        return expect(getCaptureAppUserDatabases()).resolves.toEqual(
            userDatabases
        )
    })

    it('should return an empty array if there is no capture app database', () => {
        dbExists.mockImplementationOnce(() => Promise.resolve(false))
        return expect(getCaptureAppUserDatabases()).resolves.toEqual([])
    })

    it('should reject with an error when indexedDB is not available', async () => {
        delete window.indexedDB
        dbExists.mockImplementationOnce(() => Promise.resolve(true))

        return expect(getCaptureAppUserDatabases()).resolves.toEqual([])
    })

    it('should close the database connection after evaluation when the database exists', async () => {
        dbExists.mockImplementationOnce(() => Promise.resolve(true))
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

        await getCaptureAppUserDatabases()
        expect(closeMock).toHaveBeenCalledTimes(1)
    })
})
