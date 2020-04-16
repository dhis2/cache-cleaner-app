import { Help } from '@dhis2/ui-core'
import { FORM_ERROR } from 'final-form'
import i18n from '@dhis2/d2-i18n'
import propTypes from '@dhis2/prop-types'

import { Form } from '@dhis2/ui-forms'
import React from 'react'

import { Actions } from '../actions/Actions'
import { Action } from '../actions/Action'
import { FormSection } from './FormSection'
import styles from './ClearForm.module.css'

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
                        <Action onClick={() => selectAll(form)}>
                            {i18n.t('Select all')}
                        </Action>

                        <Action onClick={() => deselectAll(form)}>
                            {i18n.t('Deselect all')}
                        </Action>

                        <Action
                            disabled={!!errors[FORM_ERROR]}
                            destructive
                            primary
                            type="submit"
                        >
                            {i18n.t('Clear all selected items')}
                        </Action>
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
                        <Action
                            disabled={!!errors[FORM_ERROR]}
                            destructive
                            primary
                            type="submit"
                        >
                            {i18n.t('Clear all selected items')}
                        </Action>
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
