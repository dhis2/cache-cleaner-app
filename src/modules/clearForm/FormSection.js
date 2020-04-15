import { Button } from '@dhis2/ui-core'
import { Field, CheckboxGroup } from '@dhis2/ui-forms'
import React from 'react'
import propTypes from '@dhis2/prop-types'
import styles from './FormSection.module.css'

const formatKeyToOption = key => ({
    label: key,
    value: key,
})

export const FormSection = ({
    emptyMessage,
    form,
    headline,
    storageKeys,
    storageName,
}) => (
    <>
        <h2 className={styles.groupHeadline}>{headline}</h2>

        {!storageKeys.length && <p>{emptyMessage}</p>}

        {!!storageKeys.length && (
            <div className={styles.actions}>
                <Button
                    className={styles.action}
                    onClick={() => form.change(storageName, storageKeys)}
                >
                    Select only the following
                </Button>

                <Button
                    className={styles.action}
                    onClick={() => form.change(storageName, [])}
                >
                    Deselect only the following
                </Button>
            </div>
        )}

        <Field
            name={storageName}
            options={storageKeys.map(formatKeyToOption)}
            component={CheckboxGroup}
        />
    </>
)

FormSection.propTypes = {
    emptyMessage: propTypes.string.isRequired,
    form: propTypes.shape({
        change: propTypes.func.isRequired,
    }).isRequired,
    headline: propTypes.string.isRequired,
    storageKeys: propTypes.arrayOf(propTypes.string).isRequired,
    storageName: propTypes.string.isRequired,
}
