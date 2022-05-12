import { dbExists } from '../dbExists'
import { dhis2DatabaseNames } from '../dhis2DatabaseNames'
import { getClearableDatabases } from '../getClearableDatabases'

jest.mock('../dbExists', () => ({ dbExists: jest.fn() }))

describe('indexedDb', () => {
    afterEach(() => {
        dbExists.mockClear()
    })

    it('should return an empty array if no clearable db exists', async () => {
        dbExists.mockImplementation(() => Promise.resolve(false))
        const clearableDatabases = await getClearableDatabases()
        expect(clearableDatabases).toEqual([])
    })

    it('should return an some names if some clearable db exists', async () => {
        const expected = dhis2DatabaseNames.slice(0, 4)
        dbExists.mockImplementation((name) => {
            if (expected.includes(name)) {
                return Promise.resolve(true)
            }

            return Promise.resolve(false)
        })

        const actual = await getClearableDatabases()
        expect(actual).toEqual(expected)
    })
})
