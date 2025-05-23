import { CAPTURE_APP_VIEW_KEY } from './viewKeys.js'

export const formatDeleteValues = (values, captureAppDatabases) => {
    const { indexedDatabaseKeys, localStorageKeys, sessionStorageKeys } = values

    // user databases should only be cleared when the "dhis2ca" db is cleared
    const shouldDeleteCaptureAppDatabases =
        indexedDatabaseKeys?.includes(CAPTURE_APP_VIEW_KEY) &&
        captureAppDatabases?.length

    return {
        localStorageKeys: localStorageKeys || [],
        sessionStorageKeys: sessionStorageKeys || [],
        indexedDB: [
            ...(indexedDatabaseKeys || []),
            ...(shouldDeleteCaptureAppDatabases ? captureAppDatabases : []),
        ],
    }
}
