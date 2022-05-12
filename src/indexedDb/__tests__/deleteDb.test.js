import 'fake-indexeddb/auto'
import { dbExists } from '../dbExists'
import { deleteDb } from '../deleteDb'

jest.mock('../dbExists', () => ({
    dbExists: jest.fn(),
}))

describe('indexedDB - deleteDb', () => {
    const indexedDB = window.indexedDB

    beforeEach(async () => {
        // Reset to the fake indexedDB in case it was overwritten
        window.indexedDB = indexedDB

        // Make sure no DB exists before each test runs
        await new Promise((resolve, reject) => {
            const request = window.indexedDB.open('foo')
            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                const closeRequest = window.indexedDB.deleteDatabase('foo')
                closeRequest.onsuccess = resolve
                closeRequest.onerror = reject
            }
        })
    })

    afterEach(() => {
        dbExists.mockClear()
    })

    it('should delete an existing db', async () => {
        const dbExistsReturnMock = {
            then: (callback) => callback(true),
        }
        dbExists.mockImplementationOnce(() => dbExistsReturnMock)

        await new Promise((resolve, reject) => {
            const request = window.indexedDB.open('foo')
            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        })

        await deleteDb('foo')

        const promise = new Promise((resolve, reject) => {
            const request = window.indexedDB.open('foo')
            request.onerror = reject
            request.onupgradeneeded = resolve
            request.onsuccess = () => {
                request.result.close()
                // Can be safely rejected as "onupgradeneeded"
                // will be called before "onsuccess".
                // An already resolved promise can't be rejected
                reject()
            }
        })

        return expect(promise).resolves
    })

    it("should reject if the database doesn't exist", () => {
        const dbExistsReturnMock = {
            then: (callback) => callback(false),
        }
        dbExists.mockImplementationOnce(() => dbExistsReturnMock)

        return expect(deleteDb('foo')).rejects.toBe(undefined)
    })

    it('should not attempt to delete the database if it does not exist', () => {
        dbExists.mockImplementationOnce(() => Promise.reject())
        const spy = jest.spyOn(window.indexedDB, 'deleteDatabase')

        deleteDb('foo').catch(() => null)
        expect(spy).toHaveBeenCalledTimes(0)
    })
})
