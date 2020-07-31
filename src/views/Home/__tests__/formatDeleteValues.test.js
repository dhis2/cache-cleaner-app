import { formatDeleteValues } from '../formatDeleteValues'

describe('Home - formatDeleteValues', () => {
    it('should combine the static indexed dbs and the user indexed dbs', () => {
        const values = { indexedDatabaseKeys: ['foo'] }
        const actual = formatDeleteValues(values, ['bar'])
        const expected = expect.objectContaining({
            indexedDB: ['foo', 'bar'],
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
