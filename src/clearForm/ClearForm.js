import i18n from '@dhis2/d2-i18n'
import propTypes from '@dhis2/prop-types'
import { Button, Help, ReactFinalForm } from '@dhis2/ui'
import { FORM_ERROR } from 'final-form'
import React from 'react'
import { Actions } from '../actions/Actions'
import styles from './ClearForm.module.css'
import { FormSection } from './FormSection'

const { Form } = ReactFinalForm

const validate = values => {
    const errors = {}

    if (
        !values.localStorageKeys.length &&
        !values.sessionStorageKeys.length &&
        !values.indexedDatabaseKeys.length
    ) {
        errors[FORM_ERROR] = i18n.t('No data selected')
    }

    return errors
}

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
            validate={validate}
        >
            {({ handleSubmit, errors, submitFailed, form }) => (
                <form onSubmit={handleSubmit}>
                    <Actions>
                        <Button
                            onClick={() => selectAll(form)}
                            dataTest="dhis2-cachecleaner-selectall"
                        >
                            {i18n.t('Select all')}
                        </Button>

                        <Button
                            onClick={() => deselectAll(form)}
                            dataTest="dhis2-cachecleaner-deselectall"
                        >
                            {i18n.t('Deselect all')}
                        </Button>

                        <Button
                            disabled={!!errors[FORM_ERROR]}
                            destructive
                            type="submit"
                            dataTest="dhis2-cachecleaner-clear-top"
                        >
                            {i18n.t('Clear all selected items')}
                        </Button>
                    </Actions>

                    <FormSection
                        form={form}
                        emptyMessage={i18n.t('Local storage empty')}
                        selectButtonLabel={i18n.t(
                            'Select all local storage items'
                        )}
                        deselectButtonLabel={i18n.t(
                            'Deselect all local storage items'
                        )}
                        headline={i18n.t('Local storage')}
                        storageKeys={localStorageKeys}
                        storageName="localStorageKeys"
                    />

                    <FormSection
                        form={form}
                        emptyMessage={i18n.t('Session storage empty')}
                        selectButtonLabel={i18n.t(
                            'Select all session storage items'
                        )}
                        deselectButtonLabel={i18n.t(
                            'Deselect all session storage items'
                        )}
                        headline={i18n.t('Session storage')}
                        storageKeys={sessionStorageKeys}
                        storageName="sessionStorageKeys"
                    />

                    <FormSection
                        form={form}
                        emptyMessage={i18n.t('No indexed databases')}
                        selectButtonLabel={i18n.t('Select all databases')}
                        deselectButtonLabel={i18n.t('Deselect all databases')}
                        headline={i18n.t('Indexed database')}
                        storageKeys={indexedDatabaseKeys}
                        storageName="indexedDatabaseKeys"
                    />

                    <div className={styles.formErrors}>
                        {errors[FORM_ERROR] && submitFailed && (
                            <Help error>{errors[FORM_ERROR]}</Help>
                        )}
                    </div>

                    <Actions>
                        <Button
                            disabled={!!errors[FORM_ERROR]}
                            destructive
                            type="submit"
                            dataTest="dhis2-cachecleaner-clear-bottom"
                        >
                            {i18n.t('Clear all selected items')}
                        </Button>
                    </Actions>
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
