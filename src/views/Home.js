import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ClearForm } from '../clearForm'
import { useClearableDatabaseKeys } from '../indexedDb'
import { useClearableStorageKeys } from '../storage'
import styles from './Home.module.css'
import { deleteValues } from './Home/deleteValues'
import { formatDeleteValues } from './Home/formatDeleteValues'

export const Home = () => {
    const { keys: localStorageKeys, refetch: refetchLocalStorageKeys } =
        useClearableStorageKeys(window.localStorage)

    const { keys: sessionStorageKeys, refetch: refetchSessionStorageKeys } =
        useClearableStorageKeys(window.sessionStorage)

    const {
        loading,
        error,
        data: indexedDatabaseKeys,
        refetch: refetchIndexedDatabaseKeys,
    } = useClearableDatabaseKeys()
    const { staticDatabases, userDatabases } = indexedDatabaseKeys

    const refetch = async () => {
        refetchLocalStorageKeys()
        refetchSessionStorageKeys()
        await refetchIndexedDatabaseKeys()
    }

    const onSubmit = async (values) => {
        const formattedValues = formatDeleteValues(values, userDatabases)
        await deleteValues(formattedValues)
        await refetch()
    }

    const showContent = !loading && !error

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
