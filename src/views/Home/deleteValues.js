import { clearDatabasesByKey } from '../../indexedDb'
import { clearStoragesByKey } from '../../storage'

const clearLocalStorageByKeys = keys =>
    clearStoragesByKey(window.localStorage, keys)

const clearSessionStorageByKeys = keys =>
    clearStoragesByKey(window.sessionStorage, keys)

export const deleteValues = async values => {
    if (values.localStorageKeys) {
        clearLocalStorageByKeys(values.localStorageKeys)
    }

    if (values.sessionStorageKeys) {
        clearSessionStorageByKeys(values.sessionStorageKeys)
    }

    if (values.indexedDB?.length) {
        await clearDatabasesByKey(values.indexedDB)
    }
}
