import { ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Actions.module.css'

export const Actions = ({ children }) => (
    <div className={styles.actions}>
        <ButtonStrip>{children}</ButtonStrip>
    </div>
)

Actions.propTypes = {
    children: PropTypes.node,
}
