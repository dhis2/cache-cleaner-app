import { useEffect, useState } from 'react'

import { dbExists } from './dbExists'
import { getKeyFromObjectStore } from './getKeyFromObjectStore'
import { openDb } from './openDb'

const userCachesStoreName = 'userCaches'

export const useCaptureAppUserDatabaseKeys = () => {
    const [refetchCounter, setRefetchCounter] = useState(0)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const refetch = () => setRefetchCounter(refetchCounter + 1)
    console.log('data', data)

    useEffect(() => {
        setLoading(true)

        if (dbExists('dhis2ca')) {
            openDb('dhis2ca')
                .then(db =>
                    getKeyFromObjectStore(
                        db,
                        userCachesStoreName,
                        'accessHistory'
                    )
                )
                .then(data => {
                    if (data && data.values) {
                        setData(data.values)
                    } else {
                        setData([])
                    }
                })
                .catch(() => setData([]))
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setData([])
            setLoading(false)
        }
    }, [refetchCounter])

    return { loading, data, refetch }
}
