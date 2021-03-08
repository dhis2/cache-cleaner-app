import { useEffect, useState } from 'react'
import { getCaptureAppUserDatabases } from './getCaptureAppUserDatabases'
import { getClearableDatabases } from './getClearableDatabases'

export const useClearableDatabaseKeys = () => {
    const [refetchCounter, setRefetchCounter] = useState(0)
    const refetch = () => setRefetchCounter(refetchCounter + 1)

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        // Contains all databases that are listed in the
        // "dhis2DatabaseNames" file that acutally exist
        staticDatabases: [],

        // these won't be listed, but should be deleted
        // if the static database "dhis2ca" is deleted by the user
        userDatabases: [],
    })

    useEffect(() => {
        const operation = async () => {
            setLoading(true)

            const staticDatabases = await getClearableDatabases().catch(
                () => []
            )
            const userDatabases = await getCaptureAppUserDatabases().catch(
                () => []
            )

            const allDatabases = {
                staticDatabases,
                userDatabases,
            }

            setData(allDatabases)
            setLoading(false)
        }

        operation()
    }, [refetchCounter])

    return { loading, data, refetch }
}
