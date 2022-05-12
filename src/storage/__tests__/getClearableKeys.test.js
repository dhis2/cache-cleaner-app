import { getClearableKeys } from '../getClearableKeys'

describe('storage - getClearableKeys', () => {
    it('should not return properties that are part of the prototype', () => {
        const prototypeProps = Object.keys(Storage.prototype)
        const clearableKeys = getClearableKeys(localStorage)
        expect(clearableKeys).toEqual(
            expect.not.arrayContaining(prototypeProps)
        )
    })

    it('should not include any dhis2 key that should not be deletable', () => {
        const nonDeletableKeys = [
            'dhis2.menu.ui.headerBar.title',
            'dhis2.menu.ui.headerBar.link',
            'dhis2.menu.ui.headerBar.userStyle',
            'DHIS2_BASE_URL',
        ]

        nonDeletableKeys.forEach((nonDeletableKey) => {
            localStorage.setItem(nonDeletableKey, 'value')

            // make sure the value has been set correctly
            expect(localStorage.getItem(nonDeletableKey)).toBe('value')
        })

        const clearableKeys = getClearableKeys(localStorage)
        expect(clearableKeys).toEqual(
            expect.not.arrayContaining(nonDeletableKeys)
        )
    })

    it('should include all keys of the localStorage', () => {
        const deletableKeys = ['foo', 'bar', 'baz']

        deletableKeys.forEach((deletableKey) => {
            localStorage.setItem(deletableKey, 'value')

            // make sure the value has been set correctly
            expect(localStorage.getItem(deletableKey)).toBe('value')
        })

        const clearableKeys = getClearableKeys(localStorage)
        expect(clearableKeys).toEqual(deletableKeys)
    })
})
