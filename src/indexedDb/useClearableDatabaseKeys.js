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

    // We need the ABSOLUTE base url for the instance when getting the Capture app databases
    // The baseUrl of the root object returned by useConfig is not reliable here as it returns a relative url for: some backend versions (v41 and below) / app-shell versions
    // The latest app-shell will inject the backend's contextPath into the app as baseUrl for backend versions 42 and above, but since we currently need support for older backends we are grabbing the contextPath directly
    const { systemInfo: { contextPath } = {} } = useConfig()

    useEffect(() => {
        const operation = async () => {
            setLoading(true)

            const staticDatabases = await getClearableDatabases().catch(
                () => []
            )

            const captureAppDatabases = await getCaptureAppDatabases(
                contextPath
            )

            const allDatabases = {
                staticDatabases,
                captureAppDatabases,
            }

            setData(allDatabases)
            setLoading(false)
        }

        operation()
    }, [refetchCounter, contextPath])

    return { loading, data, refetch }
}
