export const deleteDb = name =>
    new Promise((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase(name)

        request.onsuccess = resolve
        request.onerror = reject
    })
