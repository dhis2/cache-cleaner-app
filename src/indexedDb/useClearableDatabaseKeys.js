import { useConfig } from '@dhis2/app-runtime'
import { useEffect, useState } from 'react'
import { getCaptureAppDatabases } from './getCaptureAppDatabases.js'
import { getClearableDatabases } from './getClearableDatabases.js'

export const useClearableDatabaseKeys = () => {
    const [refetchCounter, setRefetchCounter] = useState(0)
    const refetch = () =>
        setRefetchCounter(
            (previousRefetchCounter) => previousRefetchCounter + 1
        )

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        // Contains all databases that are listed in the
        // "dhis2DatabaseNames" file that acutally exist
        staticDatabases: [],

        // If there are any capture app databases, these can all be deleted by selecting "dhis2ca" from the UI
        captureAppDatabases: [],
    })
    const { baseUrl } = useConfig()

    useEffect(() => {
        const operation = async () => {
            setLoading(true)

            const staticDatabases = await getClearableDatabases().catch(
                () => []
            )

            const captureAppDatabases = await getCaptureAppDatabases(baseUrl)

            const allDatabases = {
                staticDatabases,
                captureAppDatabases,
            }

            setData(allDatabases)
            setLoading(false)
        }

        operation()
    }, [refetchCounter, baseUrl])

    return { loading, data, refetch }
}
