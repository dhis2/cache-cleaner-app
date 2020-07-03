import { dbExists } from './dbExists'
import { getKeyFromObjectStore } from './getKeyFromObjectStore'
import { openDb } from './openDb'

const userCachesStoreName = 'userCaches'

export const getCaptureAppUserDatabases = () =>
    dbExists('dhis2ca').then(async captureDbExists => {
        let dbNames = []

        console.log('captureDbExists', captureDbExists)
        if (captureDbExists) {
            try {
                const db = await openDb('dhis2ca')
                const data = await getKeyFromObjectStore(
                    db,
                    userCachesStoreName,
                    'accessHistory'
                )

                db.close()

                if (data && data.values) {
                    dbNames = data.values.map(name => `dhis2ca${name}`)
                }
            } catch (e) {
                dbNames = []
            }
        }

        return dbNames
    })
