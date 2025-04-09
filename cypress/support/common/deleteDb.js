export const deleteDb = (win, name) =>
    new Promise((resolve, reject) => {
        const request = win.indexedDB.deleteDatabase(name)

        request.onsuccess = () => {
            expect(request.result).to.equal(undefined)
            resolve()
        }

        request.onerror = reject
    })
