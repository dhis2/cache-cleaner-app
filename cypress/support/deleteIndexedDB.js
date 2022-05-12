const deleteIndexedDB = (name) =>
    cy.window().then(
        (win) =>
            new Promise((resolve, reject) => {
                const request = win.indexedDB.deleteDatabase(name)
                request.onsuccess = resolve
                request.onerror = reject
            })
    )

Cypress.Commands.add('deleteIndexedDB', deleteIndexedDB)
