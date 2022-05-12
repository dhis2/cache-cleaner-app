import { reservedStorageKeys } from './reservedStorageKeys'

/**
 * @param {Storage} strage
 * @returns {String[]}
 */
export const getClearableKeys = (storage) =>
    Object.keys(storage).filter((key) => !reservedStorageKeys.includes(key))
