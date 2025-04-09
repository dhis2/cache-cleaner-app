import { dbExists } from './dbExists.js'
import { getKeyFromObjectStore } from './getKeyFromObjectStore.js'
import { openDb } from './openDb.js'

const userCachesStoreName = 'userCaches'

const getDatabases = async (
    sourceDbName,
    hasSeparateDatabaseForOfflineData = false
) => {
    let dbNames
    let db

    try {
        const captureDbExists = await dbExists(sourceDbName)

        if (!captureDbExists) {
            return []
        }

        dbNames = [sourceDbName]
        db = await openDb(sourceDbName)
        const accessHistory = await getKeyFromObjectStore(
            db,
            userCachesStoreName,
            'accessHistory'
        )

        if (accessHistory?.values) {
            dbNames = [...dbNames, ...accessHistory.values]
        }

        if (hasSeparateDatabaseForOfflineData) {
            const offlineDataAccessHistory = await getKeyFromObjectStore(
                db,
                userCachesStoreName,
                'offlineDataAccessHistory'
            )

            if (offlineDataAccessHistory?.values) {
                dbNames = [...dbNames, ...offlineDataAccessHistory.values]
            }
        }
    } catch {
        dbNames = []
    } finally {
        db && db.close()
    }

    return dbNames
}

const getDatabasesForOldAppVersions = () => {
    return getDatabases('dhis2ca')
}

const hashSHA256 = async (input) => {
    const inputUint8 = new TextEncoder().encode(input)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', inputUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const getDatabasesForNewAppVersions = async (baseUrl) => {
    const instanceDbName = 'dhis2ca-' + (await hashSHA256(baseUrl))
    return getDatabases(instanceDbName, true)
}

export const getCaptureAppDatabases = async (baseUrl) =>
    (
        await Promise.all([
            getDatabasesForOldAppVersions(),
            getDatabasesForNewAppVersions(baseUrl),
        ])
    ).flatMap((dbNames) => dbNames)
