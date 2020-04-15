import { deleteDb } from './deleteDb'

/**
 * @param {string} name
 * @returns {Promise.<bool>}
 */
export const dbExists = name =>
    new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name)
        let alreadyExists = true

        request.onsuccess = () => {
            request.result.close()

            if (!alreadyExists) {
                deleteDb(name)
            }

            resolve(alreadyExists)
        }

        request.onerror = error => reject(error)

        request.onupgradeneeded = () => (alreadyExists = false)
    })
