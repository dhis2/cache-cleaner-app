import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui-core'
import React from 'react'
import propTypes from '@dhis2/prop-types'

const ConfirmationSection = ({ title, keys }) => (
    <div>
        <h2>{title}</h2>

        <ul>
            {keys.map(key => (
                <li key={key}>{key}</li>
            ))}
        </ul>
    </div>
)

ConfirmationSection.propTypes = {
    keys: propTypes.arrayOf(propTypes.string).isRequired,
    title: propTypes.string.isRequired,
}

export const ConfirmationModal = ({ abort, proceed, values }) => (
    <Modal onClose={abort}>
        <ModalTitle>SURE???!!</ModalTitle>

        <ModalContent>
            {!!values.localStorageKeys.length && (
                <ConfirmationSection
                    title="Local storage"
                    keys={values.localStorageKeys}
                />
            )}

            {!!values.sessionStorageKeys && (
                <ConfirmationSection
                    title="Session storage"
                    keys={values.sessionStorageKeys}
                />
            )}

            {!!values.indexedDatabaseKeys && (
                <ConfirmationSection
                    title="Indexed databases"
                    keys={values.indexedDatabaseKeys}
                />
            )}
        </ModalContent>

        <ModalActions>
            <Button primary onClick={abort}>
                Cancel
            </Button>

            <Button onClick={proceed}>Delete cache</Button>
        </ModalActions>
    </Modal>
)

ConfirmationModal.propTypes = {
    abort: propTypes.func.isRequired,
    proceed: propTypes.func.isRequired,
    values: propTypes.shape({
        indexedDatabaseKeys: propTypes.arrayOf(propTypes.string),
        localStorageKeys: propTypes.arrayOf(propTypes.string),
        sessionStorageKeys: propTypes.arrayOf(propTypes.string),
    }).isRequired,
}
