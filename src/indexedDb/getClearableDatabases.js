import { dbExists } from './dbExists.js'
import { dhis2DatabaseNames } from './dhis2DatabaseNames.js'

/**
 * @returns {Promise.<String[]>}
 */
export const getClearableDatabases = () =>
    Promise.all(
        dhis2DatabaseNames.map((name) =>
            dbExists(name).then((exists) => (exists ? name : null))
        )
    ).then((keys) => {
        const filtered = keys.filter((key) => key)
        return filtered
    })
