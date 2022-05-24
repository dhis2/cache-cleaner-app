import { deleteDb } from './deleteDb.js'

export const clearDatabasesByKey = (keys) => {
    const allDeleteProcesses = keys.map((key) => deleteDb(key, true))
    return Promise.all(allDeleteProcesses)
}
