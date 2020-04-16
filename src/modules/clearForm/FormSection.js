import { Field, CheckboxGroup } from '@dhis2/ui-forms'
import React from 'react'
import propTypes from '@dhis2/prop-types'

import { Actions } from '../actions/Actions'
import { Action } from '../actions/Action'
import styles from './FormSection.module.css'

const formatKeyToOption = key => ({
    label: key,
    value: key,
})

export const FormSection = ({
    deselectButtonLabel,
    emptyMessage,
    form,
    headline,
    selectButtonLabel,
    storageKeys,
    storageName,
}) => (
    <div className={styles.container}>
        <h2 className={styles.groupHeadline}>{headline}</h2>

        {!storageKeys.length && <p>{emptyMessage}</p>}

        {!!storageKeys.length && (
            <Actions>
                <Action onClick={() => form.change(storageName, storageKeys)}>
                    {selectButtonLabel}
                </Action>

                <Action onClick={() => form.change(storageName, [])}>
                    {deselectButtonLabel}
                </Action>
            </Actions>
        )}

        <Field
            name={storageName}
            options={storageKeys.map(formatKeyToOption)}
            component={CheckboxGroup}
        />
    </div>
)

FormSection.propTypes = {
    deselectButtonLabel: propTypes.string.isRequired,
    emptyMessage: propTypes.string.isRequired,
    form: propTypes.shape({
        change: propTypes.func.isRequired,
    }).isRequired,
    headline: propTypes.string.isRequired,
    selectButtonLabel: propTypes.string.isRequired,
    storageKeys: propTypes.arrayOf(propTypes.string).isRequired,
    storageName: propTypes.string.isRequired,
}
