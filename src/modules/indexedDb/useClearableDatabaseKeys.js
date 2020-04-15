import { useEffect, useState } from 'react'

import { getClearableDatabases } from './getClearableDatabases'

export const useClearableDatabaseKeys = () => {
    const [refetchCounter, setRefetchCounter] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [data, setData] = useState([])
    const refetch = () => setRefetchCounter(refetchCounter + 1)

    useEffect(() => {
        setLoading(true)
        getClearableDatabases()
            .then(keys => {
                setData(keys)
                setLoading(false)
            })
            .catch(error => {
                setError(error)
                setLoading(false)
            })
    }, [refetchCounter])

    return { loading, error, data, refetch }
}
