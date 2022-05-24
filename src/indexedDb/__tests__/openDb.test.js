import 'fake-indexeddb/auto.js'
import FDBDatabase from 'fake-indexeddb/lib/FDBDatabase.js'
import { openDb } from '../openDb.js'

describe('indexedDB - openDb', () => {
    let db
    const indexedDB = window.indexedDB

    afterEach(() => {
        db?.close()

        // Reset to the fake indexedDB in case it was overwritten
        window.indexedDB = indexedDB

        // Make sure no DB exists before each test runs
        return new Promise((resolve, reject) => {
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

    it('should resolve with a database instance', async () => {
        // create db
        await new Promise((resolve, reject) => {
            const request = window.indexedDB.open('foo')
            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        })

        db = await openDb('foo')
        expect(db).toBeInstanceOf(FDBDatabase)
    })

    it('should create a database if none exists', async () => {
        db = await openDb('foo')
        expect(db).toBeInstanceOf(FDBDatabase)
    })

    it('should reject when an error occurs', async () => {
        let error
        delete window.indexedDB

        await openDb('foo').catch((e) => (error = e))
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe("Cannot read property 'open' of undefined")
    })
})
