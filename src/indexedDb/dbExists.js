import { deleteDb } from './deleteDb.js'

/**
 * @param {string} name
 * @returns {Promise.<bool>}
 */
export const dbExists = (name) =>
    new Promise((resolve, reject) => {
        let alreadyExists = true
        const request = window.indexedDB.open(name)

        request.onsuccess = () => {
            request.result.close()

            if (!alreadyExists) {
                deleteDb(name).then(() => resolve(false))
            } else {
                resolve(true)
            }
        }

        request.onerror = (error) => reject(error)
        request.onupgradeneeded = () => (alreadyExists = false)
    })
