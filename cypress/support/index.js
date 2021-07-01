import { enableAutoLogin, enableNetworkShim } from '@dhis2/cypress-commands'
import './all'

// storage
import './clearStorage'
import './localStorage'
import './sessionStorage'
import './getAllItems'
import './getItem'
import './setItems'
import './storage'

// indexedDB
import './addDataToObjectStore'
import './createObjectStore'
import './deleteIndexedDB'
import './openIndexedDB'
import './readDataFromObjectStore'

// storage + indexedDB
import './storageShouldHaveItems'

enableAutoLogin()
enableNetworkShim()
