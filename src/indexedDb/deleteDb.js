import { dbExists } from './dbExists'

export const deleteDb = (name, succeedWhenNonExistant = false) =>
    dbExists(name).then((exists) => {
        if (exists) {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.deleteDatabase(name)

                request.onsuccess = resolve
                request.onerror = reject
            })
        }

        return succeedWhenNonExistant ? Promise.resolve() : Promise.reject()
    })
