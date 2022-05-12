import { clearStoragesByKey } from '../clearStoragesByKey'

describe('storage - clearStoragesByKey', () => {
    const storages = [window.localStorage, window.sessionStorage]

    beforeEach(() => {
        storages.forEach((storage) => {
            storage.removeItem('foo')
            storage.removeItem('bar')
        })
    })

    it('should successfully delete existing items', () => {
        storages.forEach((storage) => {
            storage.setItem('foo', 'Foo')
            storage.setItem('bar', 'Bar')
        })

        const afterSetState = storages.map((storage) => [
            storage.getItem('foo'),
            storage.getItem('bar'),
        ])

        expect(afterSetState).toEqual([
            ['Foo', 'Bar'],
            ['Foo', 'Bar'],
        ])

        const success =
            clearStoragesByKey(window.localStorage, ['foo', 'bar']) &&
            clearStoragesByKey(window.sessionStorage, ['foo', 'bar'])

        expect(success).toBe(true)

        const afterRemoveState = storages.map((storage) => [
            storage.getItem('foo'),
            storage.getItem('bar'),
        ])

        expect(afterRemoveState).toEqual([
            [null, null],
            [null, null],
        ])
    })

    it('should return true when none of the items exist', () => {
        const beforeCallState = storages.map((storage) => [
            storage.getItem('foo'),
            storage.getItem('bar'),
        ])

        expect(beforeCallState).toEqual([
            [null, null],
            [null, null],
        ])

        const success =
            clearStoragesByKey(window.localStorage, ['foo', 'bar']) &&
            clearStoragesByKey(window.sessionStorage, ['foo', 'bar'])

        expect(success).toBe(true)
    })
})
