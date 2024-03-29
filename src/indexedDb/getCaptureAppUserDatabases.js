import { dbExists } from './dbExists.js'
import { getKeyFromObjectStore } from './getKeyFromObjectStore.js'
import { openDb } from './openDb.js'

const userCachesStoreName = 'userCaches'

export const getCaptureAppUserDatabases = () =>
    dbExists('dhis2ca').then(async (captureDbExists) => {
        let db
        let dbNames = []

        if (captureDbExists) {
            try {
                db = await openDb('dhis2ca')
                const data = await getKeyFromObjectStore(
                    db,
                    userCachesStoreName,
                    'accessHistory'
                )

                if (data && data.values) {
                    dbNames = data.values
                }
            } catch (e) {
                dbNames = []
            } finally {
                db && db.close()
            }
        }

        return dbNames
    })
