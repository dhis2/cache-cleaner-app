import '@dhis2/cli-utils-cypress/support'
import './all'
import { loginAndPersistSession } from './network/loginAndPersistSession'

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

loginAndPersistSession()
