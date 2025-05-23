import { act, renderHook, waitFor } from '@testing-library/react'
import { useClearableStorageKeys } from '../useClearableStorageKeys.js'

describe('storage - useClearableStorageKeys', () => {
    const storage = window.localStorage

    afterEach(() => {
        storage.removeItem('foo')
    })

    it('should return an all storage items initially', () => {
        storage.setItem('foo', 'bar')
        const { result } = renderHook(() => useClearableStorageKeys(storage))
        expect(result.current.keys).toEqual(['foo'])
    })

    it('should update the keys when the refetch function has been called', async () => {
        const { result } = renderHook(() => useClearableStorageKeys(storage))

        expect(result.current.keys).toEqual([])

        await act(async () => {
            storage.setItem('foo', 'foo')
            result.current.refetch()
        })

        await waitFor(() => expect(result.current.keys).toEqual(['foo']))
    })
})
