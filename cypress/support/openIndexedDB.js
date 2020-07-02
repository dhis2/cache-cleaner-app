const openIndexedDB = (name, onUpgradeNeeded) =>
    cy.window().then(
        win =>
            new Promise((resolve, reject) => {
                const request = win.indexedDB.open(name)

                request.onerror = reject

                if (onUpgradeNeeded) {
                    request.onupgradeneeded = event => {
                        const db = event.target.result
                        onUpgradeNeeded(db)
                    }
                }

                request.onsuccess = event => {
                    const db = event.target.result
                    resolve(db)
                }
            })
    )

Cypress.Commands.add('openIndexedDB', openIndexedDB)
