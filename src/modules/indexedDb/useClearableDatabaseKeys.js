import { useEffect, useState } from 'react'

import { getClearableDatabases } from './getClearableDatabases'

export const useClearableDatabaseKeys = () => {
    const [refetchCounter, setRefetchCounter] = useState(0)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const refetch = () => setRefetchCounter(refetchCounter + 1)

    useEffect(() => {
        setLoading(true)
        getClearableDatabases()
            .then(keys => setData(keys))
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [refetchCounter])

    return { loading, data, refetch }
}
