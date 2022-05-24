import propTypes from '@dhis2/prop-types'
import {
    Button,
    FieldGroupFF,
    ReactFinalForm,
    CheckboxFieldFF,
} from '@dhis2/ui'
import React from 'react'
import { Actions } from '../actions/Actions.js'
import styles from './FormSection.module.css'

const { Field } = ReactFinalForm

export const FormSection = ({
    deselectButtonLabel,
    emptyMessage,
    form,
    headline,
    selectButtonLabel,
    storageKeys,
    storageName,
}) => {
    const storageDataTestName = storageName.toLowerCase()

    return (
        <div
            className={styles.container}
            data-test={`dhis2-cachecleaner-${storageDataTestName}`}
        >
            <h2 className={styles.groupHeadline}>{headline}</h2>

            {!storageKeys.length && (
                <p data-test="dhis2-cachecleaner-emptystoragemessage">
                    {emptyMessage}
                </p>
            )}

            {!!storageKeys.length && (
                <Actions>
                    <Button
                        onClick={() => form.change(storageName, storageKeys)}
                        dataTest={`dhis2-cachecleaner-formsection-selectall`}
                    >
                        {selectButtonLabel}
                    </Button>

                    <Button
                        onClick={() => form.change(storageName, [])}
                        dataTest={`dhis2-cachecleaner-formsection-deselectall`}
                    >
                        {deselectButtonLabel}
                    </Button>
                </Actions>
            )}
            <FieldGroupFF>
                {storageKeys.map((key) => {
                    return (
                        <Field
                            type="checkbox"
                            component={CheckboxFieldFF}
                            name={storageName}
                            label={key}
                            key={key}
                            value={key}
                        />
                    )
                })}
            </FieldGroupFF>
        </div>
    )
}

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
