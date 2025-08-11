import { deleteDb } from './deleteDb.js'

export const dbExists = (win, name) =>
    new Promise((resolve, reject) => {
        let alreadyExists = true
        const request = win.indexedDB.open(name)

        request.onsuccess = () => {
            request.result.close()

            if (!alreadyExists) {
                deleteDb(win, name).then(() => resolve(false))
            } else {
                resolve(true)
            }
        }

        request.onerror = (error) => reject(error)
        request.onupgradeneeded = () => (alreadyExists = false)
    })
