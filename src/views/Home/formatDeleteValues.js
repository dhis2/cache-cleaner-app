export const formatDeleteValues = (values, userDatabases) => {
    const { indexedDatabaseKeys, localStorageKeys, sessionStorageKeys } = values

    // user databases should only be cleared when the "dhis2ca" db is cleared
    const shouldDeleteUserDatabases =
        indexedDatabaseKeys?.includes('dhis2ca') && userDatabases?.length

    return {
        localStorageKeys: localStorageKeys || [],
        sessionStorageKeys: sessionStorageKeys || [],
        indexedDB: [
            ...(indexedDatabaseKeys || []),
            ...(shouldDeleteUserDatabases ? userDatabases : []),
        ],
    }
}
