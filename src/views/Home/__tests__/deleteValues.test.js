import { clearDatabasesByKey } from '../../../indexedDb'
import { clearStoragesByKey } from '../../../storage'
import { deleteValues } from '../deleteValues'

jest.mock('../../../storage/clearStoragesByKey', () => ({
    clearStoragesByKey: jest.fn(),
}))

jest.mock('../../../indexedDb/clearDatabasesByKey', () => ({
    clearDatabasesByKey: jest.fn(),
}))

describe('Home - deleteValues', () => {
    it('should pass all local storage keys to "clearStoragesByKey"', async () => {
        const values = {
            localStorageKeys: ['foo', 'bar'],
        }

        await deleteValues(values)

        expect(clearStoragesByKey).toHaveBeenCalledWith(window.localStorage, [
            'foo',
            'bar',
        ])
    })

    it('should pass all session storage keys to "clearStoragesByKey"', async () => {
        const values = {
            sessionStorageKeys: ['foo', 'bar'],
        }

        await deleteValues(values)

        expect(clearStoragesByKey).toHaveBeenCalledWith(window.sessionStorage, [
            'foo',
            'bar',
        ])
    })

    it('should pass all database keys to "clearDatabasesByKey"', async () => {
        const values = {
            indexedDB: ['foo', 'bar'],
        }

        await deleteValues(values)

        expect(clearDatabasesByKey).toHaveBeenCalledWith(['foo', 'bar'])
    })
})
