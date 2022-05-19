import { enableAutoLogin, enableNetworkShim } from '@dhis2/cypress-commands'
import './all.js'

// storage
import './clearStorage.js'
import './localStorage.js'
import './sessionStorage.js'
import './getAllItems.js'
import './getItem.js'
import './setItems.js'
import './storage.js'

// indexedDB
import './addDataToObjectStore.js'
import './createObjectStore.js'
import './deleteIndexedDB.js'
import './openIndexedDB.js'
import './readDataFromObjectStore.js'

// storage + indexedDB
import './storageShouldHaveItems.js'

enableAutoLogin()
enableNetworkShim()
