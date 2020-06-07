const createObjectStore = (db, name) => {
    db.createObjectStore(name)
    return db
}

Cypress.Commands.add('createObjectStore', createObjectStore)
