export const clearStoragesByKey = (storage, keys) => {
    // remove keys
    keys.forEach((key) => storage.removeItem(key))

    // return removal check
    return keys.reduce((success, key) => {
        // fail if already failed
        if (!success) {
            return false
        }
        return storage.getItem(key) === null
    }, true)
}
