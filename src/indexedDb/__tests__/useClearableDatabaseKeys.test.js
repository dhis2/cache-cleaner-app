import { act, renderHook } from '@testing-library/react-hooks'
import { getCaptureAppDatabases } from '../getCaptureAppDatabases.js'
import { getClearableDatabases } from '../getClearableDatabases.js'
import { useClearableDatabaseKeys } from '../useClearableDatabaseKeys.js'

jest.mock('../getClearableDatabases', () => ({
    getClearableDatabases: jest.fn(() => Promise.reject()),
}))

jest.mock('../getCaptureAppDatabases', () => ({
    getCaptureAppDatabases: jest.fn(() => {
        console.log('Mocked')
        return Promise.reject()
    }),
}))

describe('indexedDB - useClearableDatabaseKeys', () => {
    const clearableDatabases = ['dhis2ma']
    const clearableCaptureAppDatabases = ['dhis2ca', 'dhis2cafoo', 'dhis2cabar']

    getClearableDatabases.mockImplementation(
        () => new Promise((resolve) => resolve(clearableDatabases))
    )
    getCaptureAppDatabases.mockImplementation(
        () => new Promise((resolve) => resolve(clearableCaptureAppDatabases))
    )

    afterEach(() => {
        getClearableDatabases.mockClear()
        getCaptureAppDatabases.mockClear()
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
            captureAppDatabases: clearableCaptureAppDatabases,
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(1)
        expect(getCaptureAppDatabases).toHaveBeenCalledTimes(1)
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
            captureAppDatabases: clearableCaptureAppDatabases,
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(1)
        expect(getCaptureAppDatabases).toHaveBeenCalledTimes(1)

        getClearableDatabases.mockImplementationOnce(
            () => new Promise((resolve) => resolve(['foo', 'bar']))
        )
        getCaptureAppDatabases.mockImplementationOnce(
            () => new Promise((resolve) => resolve(['baz', 'foobar']))
        )

        await act(async () => {
            result.current.refetch()
            await waitForNextUpdate()
        })

        expect(result.current.data).toEqual({
            staticDatabases: ['foo', 'bar'],
            captureAppDatabases: ['baz', 'foobar'],
        })
        expect(getClearableDatabases).toHaveBeenCalledTimes(2)
        expect(getCaptureAppDatabases).toHaveBeenCalledTimes(2)
    })
})
