import React, { useState } from 'react'

import { ClearForm } from '../modules/clearForm/ClearForm'
import { ConfirmationModal } from '../modules/confirmationModal/ConfirmationModal'
import { deleteDb } from '../modules/indexedDb/deleteDb'
import { useClearableDatabaseKeys } from '../modules/indexedDb/useClearableDatabaseKeys'
import { useClearableStorageKeys } from '../modules/storage/useClearableStorageKeys'

const deleteValues = values => {
    console.log('delete', values)
    values.localStorageKeys.forEach(key => localStorage.removeItem(key))
    values.sessionStorageKeys.forEach(key => sessionStorage.removeItem(key))
    values.indexedDatabaseKeys.forEach(key => deleteDb(key))
}

export const Home = () => {
    const {
        keys: localStorageKeys,
        refetch: refetchLocalStorageKeys,
    } = useClearableStorageKeys(window.localStorage)
    const {
        keys: sessionStorageKeys,
        refetch: refetchSessionStorageKeys,
    } = useClearableStorageKeys(window.sessionStorage)
    const {
        loading,
        error,
        data: indexedDatabaseKeys,
        refetch: refetchIndexedDatabaseKeys,
    } = useClearableDatabaseKeys()

    const [show, setShow] = useState(false)
    const [valuesToDelete, setValuesToDelete] = useState(undefined)

    if (loading) {
        return <div>Loading clearable data...</div>
    }

    if (error) {
        return <div>{`Something went wrong: ${error.message}`}</div>
    }

    return (
        <div>
            {show && (
                <ConfirmationModal
                    proceed={() => {
                        deleteValues(valuesToDelete)
                        refetchLocalStorageKeys()
                        refetchSessionStorageKeys()
                        refetchIndexedDatabaseKeys()
                        setValuesToDelete(undefined)
                        setShow(false)
                    }}
                    abort={() => setShow(false)}
                    values={valuesToDelete}
                />
            )}

            <ClearForm
                localStorageKeys={localStorageKeys}
                sessionStorageKeys={sessionStorageKeys}
                indexedDatabaseKeys={indexedDatabaseKeys}
                onSubmit={values => {
                    setValuesToDelete(values)
                    setShow(true)
                }}
                initialValues={valuesToDelete}
            />
        </div>
    )
}
