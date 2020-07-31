import { deleteDb } from './deleteDb'

export const clearDatabasesByKey = keys => Promise.all(keys.map(deleteDb))
