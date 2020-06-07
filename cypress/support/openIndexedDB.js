const openIndexedDB = (name, onUpgradeNeeded) =>
    cy.window().then(
        win =>
            new Promise((resolve, reject) => {
                console.log('openDb start')
                const request = win.indexedDB.open(name)

                request.onerror = error => {
                    console.log('Cound not open db')
                    reject(error)
                }

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
