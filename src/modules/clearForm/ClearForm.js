import { Button, Help } from '@dhis2/ui-core'
import { FORM_ERROR } from 'final-form'
import propTypes from '@dhis2/prop-types'

import { Form } from '@dhis2/ui-forms'
import React from 'react'

import { FormSection } from './FormSection'
import styles from './ClearForm.module.css'

export const ClearForm = ({
    onSubmit,
    initialValues,
    localStorageKeys,
    sessionStorageKeys,
    indexedDatabaseKeys,
}) => {
    const selectAll = form => {
        form.batch(() => {
            form.change('localStorageKeys', localStorageKeys)
            form.change('sessionStorageKeys', sessionStorageKeys)
            form.change('indexedDatabaseKeys', indexedDatabaseKeys)
        })
    }

    const deselectAll = form => {
        form.batch(() => {
            form.change('localStorageKeys', [])
            form.change('sessionStorageKeys', [])
            form.change('indexedDatabaseKeys', [])
        })
    }

    const onFormSubmit = values => {
        onSubmit(values)
    }

    return (
        <Form
            onSubmit={onFormSubmit}
            initialValues={initialValues}
            validate={values => {
                const errors = {}

                if (
                    (!values.localStorageKeys ||
                        !values.localStorageKeys.length) &&
                    (!values.sessionStorageKeys ||
                        !values.sessionStorageKeys.length) &&
                    (!values.indexedDatabaseKeys ||
                        !values.indexedDatabaseKeys.length)
                ) {
                    errors[FORM_ERROR] = 'No data selected'
                }

                return errors
            }}
        >
            {({ handleSubmit, errors, submitFailed, form }) => (
                <form onSubmit={handleSubmit}>
                    <div className={styles.actions}>
                        <Button
                            className={styles.action}
                            onClick={() => selectAll(form)}
                        >
                            Select all
                        </Button>

                        <Button
                            className={styles.action}
                            onClick={() => deselectAll(form)}
                        >
                            Deselect all
                        </Button>
                    </div>

                    <FormSection
                        form={form}
                        emptyMessage="Local storage empty"
                        headline="Local storage"
                        storageKeys={localStorageKeys}
                        storageName="localStorageKeys"
                    />

                    <FormSection
                        form={form}
                        emptyMessage="Session storage empty"
                        headline="Session storage"
                        storageKeys={sessionStorageKeys}
                        storageName="sessionStorageKeys"
                    />

                    <FormSection
                        form={form}
                        emptyMessage="No indexed databases"
                        headline="Indexed database"
                        storageKeys={indexedDatabaseKeys}
                        storageName="indexedDatabaseKeys"
                    />

                    <div className={styles.formErrors}>
                        {errors[FORM_ERROR] && submitFailed && (
                            <Help error>{errors[FORM_ERROR]}</Help>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <Button className={styles.action} primary type="submit">
                            Clear
                        </Button>
                    </div>
                </form>
            )}
        </Form>
    )
}

ClearForm.defaultProps = {
    initialValues: {
        localStorageKeys: [],
        sessionStorageKeys: [],
        indexedDatabaseKeys: [],
    },
}

ClearForm.propTypes = {
    indexedDatabaseKeys: propTypes.arrayOf(propTypes.string).isRequired,
    localStorageKeys: propTypes.arrayOf(propTypes.string).isRequired,
    sessionStorageKeys: propTypes.arrayOf(propTypes.string).isRequired,
    onSubmit: propTypes.func.isRequired,
    initialValues: propTypes.shape({
        indexedDatabaseKeys: propTypes.arrayOf(propTypes.string),
        localStorageKeys: propTypes.arrayOf(propTypes.string),
        sessionStorageKeys: propTypes.arrayOf(propTypes.string),
    }),
}
