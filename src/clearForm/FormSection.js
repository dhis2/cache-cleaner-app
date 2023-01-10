import {
    Button,
    FieldGroupFF,
    ReactFinalForm,
    CheckboxFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
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
                <p
                    className={styles.empty}
                    data-test="dhis2-cachecleaner-emptystoragemessage"
                >
                    {emptyMessage}
                </p>
            )}

            {!!storageKeys.length && (
                <Actions>
                    <Button
                        secondary
                        small
                        onClick={() => form.change(storageName, storageKeys)}
                        dataTest={`dhis2-cachecleaner-formsection-selectall`}
                    >
                        {selectButtonLabel}
                    </Button>

                    <Button
                        secondary
                        small
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
    deselectButtonLabel: PropTypes.string.isRequired,
    emptyMessage: PropTypes.string.isRequired,
    form: PropTypes.shape({
        change: PropTypes.func.isRequired,
    }).isRequired,
    headline: PropTypes.string.isRequired,
    selectButtonLabel: PropTypes.string.isRequired,
    storageKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
    storageName: PropTypes.string.isRequired,
}
