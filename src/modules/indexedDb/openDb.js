/**
 * @param {string} name
 * @returns {Promise.<IDBDatabase>}
 */
export const openDb = name =>
    new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name)

        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    })
