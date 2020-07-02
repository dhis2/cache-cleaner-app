export const getKeyFromObjectStore = (db, storeName, key) =>
    new Promise((resolve, reject) => {
        try {
            const request = db
                .transaction(storeName)
                .objectStore(storeName)
                .get(key)

            request.onsuccess = event => resolve(event.target.result)
            request.onerror = reject
        } catch (e) {
            resolve(null)
        }
    })
