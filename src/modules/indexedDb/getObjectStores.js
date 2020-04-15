import { open } from './open'

/**
 * @param {string} name
 * @returns {Promise.<DOMStringList>}
 */
export const getObjectStores = name =>
    open(name).then(db => db.objectStoreNames)
