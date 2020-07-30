import React from 'react'
import i18n from '@dhis2/d2-i18n'

import { ClearForm } from '../modules/clearForm/ClearForm'
import { deleteDb } from '../modules/indexedDb/deleteDb'
import { useClearableDatabaseKeys } from '../modules/indexedDb/useClearableDatabaseKeys'
import { useClearableStorageKeys } from '../modules/storage/useClearableStorageKeys'
import styles from './Home.module.css'

const deleteValues = async values => {
    values.localStorageKeys?.forEach(key => localStorage.removeItem(key))
    values.sessionStorageKeys?.forEach(key => sessionStorage.removeItem(key))

    if (values.indexedDB.length) {
        await Promise.all(values.indexedDB.map(deleteDb))
    }
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
    const { staticDatabases, userDatabases } = indexedDatabaseKeys

    const showContent = !loading && !error

    const onSubmit = async values => {
        const hasUserDatabases =
            values.indexedDatabaseKeys.includes('dhis2ca') &&
            userDatabases.length

        const valuesToDelete = hasUserDatabases
            ? {
                  ...values,
                  indexedDB: [...values.indexedDatabaseKeys, ...userDatabases],
              }
            : { ...values, indexedDB: values.indexedDatabaseKeys }

        await deleteValues(valuesToDelete)
        refetchLocalStorageKeys()
        refetchSessionStorageKeys()
        await refetchIndexedDatabaseKeys()
    }

    return (
        <div className={styles.container}>
            {loading && (
                <p data-test="dhis2-cachecleaner-loading">
                    {i18n.t('Loading clearable data...')}
                </p>
            )}
            {error && i18n.t(`Something went wrong: ${error.message}`)}
            {showContent && (
                <>
                    <h1
                        className={styles.headline}
                        data-test="dhis2-cachecleaner-homeheadline"
                    >
                        {i18n.t('DHIS 2 browser cache cleaner')}
                    </h1>

                    <ClearForm
                        // keep these so the previously selected values
                        // are kept for rejection in the confirmation step
                        localStorageKeys={localStorageKeys}
                        sessionStorageKeys={sessionStorageKeys}
                        indexedDatabaseKeys={staticDatabases}
                        onSubmit={onSubmit}
                    />
                </>
            )}
        </div>
    )
}
