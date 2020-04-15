import { dbExists } from './dbExists'
import { dhis2DatabaseNames } from './dhis2DatabaseNames'

/**
 * @returns {Promise.<String[]>}
 */
export const getClearableDatabases = () =>
    Promise.all(
        dhis2DatabaseNames.map(name =>
            dbExists(name)
                .then(exists => (exists ? name : null))
                .catch(e => console.log('error', e))
        )
    ).then(keys => keys.filter(key => key))
