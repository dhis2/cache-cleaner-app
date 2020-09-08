import { useCallback, useEffect, useState } from 'react'
import { getClearableKeys } from './getClearableKeys'

export const useClearableStorageKeys = storage => {
    const [existingKeys, setExistingKeys] = useState([])

    const onStorageChange = useCallback(() => {
        const existing = getClearableKeys(storage)
        setExistingKeys(existing)
    }, [storage])

    useEffect(() => {
        onStorageChange()
    }, [onStorageChange])

    return {
        keys: existingKeys,
        refetch: onStorageChange,
    }
}
