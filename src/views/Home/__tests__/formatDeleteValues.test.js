import { formatDeleteValues } from '../formatDeleteValues.js'

describe('Home - formatDeleteValues', () => {
    it.only('should combine the static indexed dbs and the user indexed dbs', () => {
        const values = { indexedDatabaseKeys: ['dhis2ca'] }
        const actual = formatDeleteValues(values, ['foo', 'bar'])
        const expected = expect.objectContaining({
            indexedDB: ['dhis2ca', 'foo', 'bar'],
        })

        expect(actual).toEqual(expected)
    })

    it('should pass through the storage keys', () => {
        const localStorageKeys = ['foo']
        const sessionStorageKeys = ['bar']
        const values = { localStorageKeys, sessionStorageKeys }
        const actual = formatDeleteValues(values)
        const expected = expect.objectContaining({
            localStorageKeys,
            sessionStorageKeys,
        })

        expect(actual).toEqual(expected)
    })

    it('should supply empty arrays when keys are missing in values', () => {
        const actual = formatDeleteValues({})
        const expected = {
            localStorageKeys: [],
            sessionStorageKeys: [],
            indexedDB: [],
        }

        expect(actual).toEqual(expected)
    })
})
