import 'fake-indexeddb/auto'
import { getKeyFromObjectStore } from '../getKeyFromObjectStore'

describe('indexedDB - getKeyFromObjectStore', () => {
    const dbName = 'databaseName'
    const storeName = 'userCaches'
    const storeKey = 'accessHistory'
    const storeKeyValues = {
        values: ['foo', 'bar'],
    }

    const createDb = (name, withStore) =>
        new Promise((resolve, reject) => {
            const request = window.indexedDB.open(name)

            request.onerror = reject

            withStore &&
                (request.onupgradeneeded = event => {
                    const db = event.target.result
                    db.createObjectStore(storeName)
                })

            request.onsuccess = event => {
                const db = event.target.result
                resolve(db)
            }
        })

    const addData = db =>
        new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite')
            transaction.oncomplete = () => resolve(db)
            transaction.onerror = reject

            // add user ids with custom indexedDBs
            const newObjectStore = transaction.objectStore(storeName)
            newObjectStore.put(storeKeyValues, storeKey)
        })

    const deleteDb = () =>
        new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(dbName)
            request.onsuccess = resolve
            request.onerror = reject
        })

    afterEach(async () => {
        await deleteDb()
    })

    it('should return some userCaches', async () => {
        const db = await createDb(dbName, true).then(addData)
        const actual = getKeyFromObjectStore(db, storeName, storeKey)
        db.close()

        return expect(actual).resolves.toEqual({ values: ['foo', 'bar'] })
    })

    it('should reject when the store does not exist', async () => {
        let error
        const db = await createDb(dbName, false)

        try {
            await getKeyFromObjectStore(db, storeName, storeKey)
        } catch (e) {
            error = e
        } finally {
            db.close()
        }

        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe(
            `No objectStore named ${storeName} in this database`
        )
    })
})
