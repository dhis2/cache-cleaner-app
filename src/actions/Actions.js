import propTypes from '@dhis2/prop-types'
import { ButtonStrip } from '@dhis2/ui'
import React from 'react'
import styles from './Actions.module.css'

export const Actions = ({ children }) => (
    <div className={styles.actions}>
        <ButtonStrip>{children}</ButtonStrip>
    </div>
)

Actions.propTypes = {
    children: propTypes.node,
}
