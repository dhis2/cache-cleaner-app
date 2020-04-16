import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { ClearForm } from '../modules/clearForm/ClearForm'
import { deleteDb } from '../modules/indexedDb/deleteDb'
import { useClearableDatabaseKeys } from '../modules/indexedDb/useClearableDatabaseKeys'
import { useClearableStorageKeys } from '../modules/storage/useClearableStorageKeys'
import styles from './Home.module.css'

const deleteValues = values => {
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

    const showContent = !loading && !error
    const onSubmit = async values => {
        deleteValues(values)
        refetchLocalStorageKeys()
        refetchSessionStorageKeys()
        await refetchIndexedDatabaseKeys()
    }

    return (
        <div className={styles.container}>
            {loading && i18n.t('Loading clearable data...')}
            {error && i18n.t(`Something went wrong: ${error.message}`)}
            {showContent && (
                <>
                    <h1 className={styles.headline}>
                        {i18n.t('DHIS 2 browser cache cleaner')}
                    </h1>

                    <ClearForm
                        // keep these so the previously selected values
                        // are kept for rejection in the confirmation step
                        localStorageKeys={localStorageKeys}
                        sessionStorageKeys={sessionStorageKeys}
                        indexedDatabaseKeys={indexedDatabaseKeys}
                        onSubmit={onSubmit}
                    />
                </>
            )}
        </div>
    )
}
