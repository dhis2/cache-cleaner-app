import { act, renderHook } from '@testing-library/react-hooks'
import { getCaptureAppUserDatabases } from '../getCaptureAppUserDatabases'
import { getClearableDatabases } from '../getClearableDatabases'
import { useClearableDatabaseKeys } from '../useClearableDatabaseKeys'

jest.mock('../getClearableDatabases', () => ({
    getClearableDatabases: jest.fn(() => Promise.reject()),
}))

jest.mock('../getCaptureAppUserDatabases', () => ({
    getCaptureAppUserDatabases: jest.fn(() => {
        console.log('Mocked')
        return Promise.reject()
    }),
}))

describe('indexedDB - useClearableDatabaseKeys', () => {
    const clearableDatabases = ['dhis2ca', 'dhis2ma']
    const clearableUserDatabases = ['dhis2cafoo', 'dhis2cabar']

    getClearableDatabases.mockImplementation(
        () => new Promise((resolve) => resolve(clearableDatabases))
    )
    getCaptureAppUserDatabases.mockImplementation(
        () => new Promise((resolve) => resolve(clearableUserDatabases))
    )

    afterEach(() => {
        getClearableDatabases.mockClear()
        getCaptureAppUserDatabases.mockClear()
    })

    it('should load the databases in the beginning', () => {
        const neverResolve = () => null
        getClearableDatabases.mockImplementationOnce(
            () => new Promise(neverResolve)
        )
        const { result } = renderHook(() => useClearableDatabaseKeys())
        expect(result.current.loading).toBe(true)
    })

    it('should set loading to false once the loading has been complete', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useClearableDatabaseKeys()
        )

        await act(async () => {
            await waitForNextUpdate()
        })

        expect(result.current.loading).toBe(false)
    })

    it('should set the clearable databases', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useClearableDatabaseKeys()
        )

        await act(async () => {
            await waitForNextUpdate()
        })

        expect(result.current.data).toEqual({
            staticDatabases: clearableDatabases,
            userDatabases: clearableUserDatabases,
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(1)
        expect(getCaptureAppUserDatabases).toHaveBeenCalledTimes(1)
    })

    it('should refetch the databases when refetch is called', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useClearableDatabaseKeys()
        )

        await act(async () => {
            await waitForNextUpdate()
        })

        expect(result.current.data).toEqual({
            staticDatabases: clearableDatabases,
            userDatabases: clearableUserDatabases,
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(1)
        expect(getCaptureAppUserDatabases).toHaveBeenCalledTimes(1)

        getClearableDatabases.mockImplementationOnce(
            () => new Promise((resolve) => resolve(['foo', 'bar']))
        )
        getCaptureAppUserDatabases.mockImplementationOnce(
            () => new Promise((resolve) => resolve(['baz', 'foobar']))
        )

        await act(async () => {
            result.current.refetch()
            await waitForNextUpdate()
        })

        expect(result.current.data).toEqual({
            staticDatabases: ['foo', 'bar'],
            userDatabases: ['baz', 'foobar'],
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(2)
        expect(getCaptureAppUserDatabases).toHaveBeenCalledTimes(2)
    })
})
