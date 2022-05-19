import 'fake-indexeddb/auto.js'
import { dbExists } from '../dbExists.js'

describe('indexedDB - dbExists', () => {
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

    it('should resolve with true if the database exists', async () => {
        await new Promise((resolve, reject) => {
            const request = window.indexedDB.open('foo')
            request.onerror = reject
            request.onsuccess = () => {
                request.result.close()
                resolve()
            }
        })

        return expect(dbExists('foo')).resolves.toBe(true)
    })

    it('should resolve with false if the database does not exist', async () => {
        return expect(dbExists('foo')).resolves.toBe(false)
    })

    it('should reject with an error when indexedDB is not available', async () => {
        delete window.indexedDB

        const expected = expect.objectContaining({
            message: "Cannot read property 'open' of undefined",
        })

        return expect(dbExists('foo')).rejects.toEqual(expected)
    })

    it('should close the database connection after evaluation when the database exists', (done) => {
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

        dbExists('foo')

        setTimeout(() => {
            expect(closeMock).toHaveBeenCalledTimes(1)
            done()
        }, 0)
    })
})
